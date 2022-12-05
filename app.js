
const express=require('express');
const morgan = require('morgan');
const App = require('express')();
const path=require('path');
const errorHandler = require('./handlers/errGlobalHandler');
const AppError=require('./utils/appError');
 
App.use(express.json());  
App.use(morgan('dev'));   

// Serving  static files
App.use(express.static(path.join(__dirname, 'public')));
 
App.use((req,res,next)=>{
req.resTime=new Date().toISOString();
console.log(req);  
next(); 
});    
 
const tourRouter = require('./routes/tourRoutes');
const userRouter =require('./routes/userRoutes');
App.use('/api/v1/tours', tourRouter);
App.use('/api/v1/users', userRouter);


// Unexisting endpoint handdling
App.all('*', (req, res, next) => {
     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // Param only applies for errors
 }); 
//App.use(errorHandler); 
   
module.exports = App;