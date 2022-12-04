const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Don't forget to enter your name"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Don't forget to provide your email address"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address"]
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, "Passsword for your account must be provided"],
        minlength: [8, "Password is too short;  minimum of 8 characters"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Confirm your password in order to continue"],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords does not match"
        }
    },
    passwordChangedAt: {
        type: Date,
        required: true,
        select: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    photo: {
        type: String,
        default: 'default.jpg'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});



userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });

    next();
});

userSchema.pre('save', function(next) {
    this.passwordChangedAt = Date.now() - 1000;
    next();
});





const User = mongoose.model('User', userSchema);

module.exports = User;