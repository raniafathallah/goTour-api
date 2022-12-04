
const express=require('express');
const morgan = require('morgan');
const App = require('express')();
const path=require('path');
App.use(express.json());
App.use(morgan('dev'));

// Serving static files
App.use(express.static(path.join(__dirname, 'public')));
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