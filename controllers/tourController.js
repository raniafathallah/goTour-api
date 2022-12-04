const catchAsync = require('../handlers/errorCatchHandler');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');

exports.getAllTours=catchAsync(async (req, res, next) => {
          // Allow nested GET reviews on tours
          let filter = {};
          if(req.params.id) filter = { tour: req.params.id };
          //
      
          const features = new APIFeatures(Tour.find(filter), req.query).filter()
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

exports.createTour=catchAsync(async(req,res)=>{
               const newDoc = await Tour.create(req.body);
               res 
                   .status(200)
                   .json({
                       status: 'success',
                       data: {
                           data: newDoc
                       }
                   });
});  

exports.getTour= ( popOptions) => catchAsync(async (req, res, next) => {

     console.log(`get tour ${req.params.id} `);
          let query = Tour.findById(req.params.id);
      
          if(popOptions) query = query.populate(popOptions);
      
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
exports.deleteTour=catchAsync(async (req, res, next) => {
     const id = req.params.id;
 
     const doc = await Tour.findByIdAndDelete(id);
 
     if(!doc) return next(new AppError('No document found with that ID', 404));
 
     res
         .status(204)
         .json({
             status: 'success',
             data: null
         });
 });

exports.updateTour=catchAsync(async (req, res, next) => {
     const id = req.params.id;
 
     const doc = await Tour.findByIdAndUpdate(id, req.body, {
         new: true,
         runValidators: true
     });
 
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



 

 

