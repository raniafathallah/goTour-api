const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const bcrypt = require('bcryptjs');


const catchAsync = require('../handlers/errorCatchHandler');
//return signature 
const signToken = id => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: 11111111110000000 
        }
    )
}
//send token within cookie for client 
const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    };

    user.password = undefined;

    res.cookie('jwt', token, cookieOptions);

    res
        .status(statusCode)
        .json({
            status: 'success',
            token,
            data: {
                user
            }
        });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });
    createSendToken(newUser, 201, req, res);
});





exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    };

    const user = await User.findOne({ email }).select('+password');

    const  correctPassword = async function(Passsword,password2){
        return await bcrypt.compare(Passsword, password2);
    };

    if(!user || !(await correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    };

    createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'logged-out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    console.log(res);

    res
        .status(200)
        .json({
            status: 'success'
        });
};

//authorize 

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Receiving token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }else if(req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if(!token) return next(new AppError('You are not logged in, please login for access', 402));

    // 2) Verificate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user exists
    const freshUser = await User.findById(decoded.id);

    if(!freshUser) return next(new AppError('User does not longer exists', 401));

    // 4) Check any password changes
    if(freshUser.changedPassword(decoded.iat)) return next(new AppError('Password changed recently please re-login', 401));

    req.user = freshUser;
    res.locals.user = freshUser;

    next();
});



exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403))
        }

        next();
    }
};
