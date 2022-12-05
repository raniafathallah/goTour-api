const User  = require('../models/userModel');
const catchAsync = require('../handlers/errorCatchHandler');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
exports.getAllUsers=catchAsync(async (req, res, next) => {

     let filter = {};
     if(req.params.id) filter = { user: req.params.id };
 
     const features = new APIFeatures(User.find(filter), req.query).filter()
                                                             .sort()
                                                             .limitFields()
                                                             .paginate();
     const docs = await features.query;
 
     res
         .status(200)
         .json({
             status: 'success',
             results: docs.length,
             data: {
                 data: docs
             }
         });
 });

 exports.createUser=catchAsync(async(req,res)=>{
     const newDoc = await User.create(req.body);
     res 
         .status(200)
         .json({
             status: 'success',
             data: {
                 data: newDoc
             }
         });
});  

 exports.getUser=catchAsync(async (req, res, next) => {

     console.log(`get user ${req.params.id} `);
          let query = User.findById(req.params.id);
      
      
          const doc = await query;
      
          if(!doc) return next(new AppError('No document found with that ID', 404));
      
          res
              .status(200)
              .json({
                  status: 'success',
                  data: {
                      data: doc
                  }
              });
});

exports.updateUser = catchAsync(async(req, res, next) => {
    if(req.body.password || req.body.passwordConfirm) return next(new AppError('Not for password updates. Please head to updateMyPassword', 400))

    const id = req.params.id;

     const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
 
     res
         .status(200)
         .json({
             status: 'success',
             data: {
                 user: updatedUser
             }
         });
 });

exports.deleteMe = catchAsync(async(req, res, next) => {
     //user id will change 
     await User.findByIdAndUpdate(req.params.id, { active: false });
 console.log(req.user);
     res 
         .status(204)
         .json({
             status: 'success',
             data: null
         });
 });

exports.deleteUser = catchAsync(async(req, res, next) => {
     await User.findByIdAndDelete(req.params.id);
 
     res 
         .status(204)
         .json({
             status: 'success',
             data: null
         });
 });

 