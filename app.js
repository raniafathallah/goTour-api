
const express=require('express');
const morgan = require('morgan');
const App = require('express')();
App.use(express.json());
App.use(morgan('dev'));
App.use((req,res,next)=>{
     console.log('hello from middle ware');
     next();
});
App.use((req,res,next)=>{
req.resTime=new Date().toISOString();
console.log(req);
next();
});

const tourRouter = require('./routes/tourRoutes');

App.use('/api/v1/tours', tourRouter);


module.exports = App;