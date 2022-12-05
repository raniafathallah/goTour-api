
const express=require('express');
const morgan = require('morgan');
const App = require('express')();
const path=require('path');
const errorHandler = require('./handlers/errGlobalHandler');
const AppError=require('./utils/appError');
 
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

App.use(express.json());  
App.use(morgan('dev'));   

// Serving  static files
App.use(express.static(path.join(__dirname, 'public')));
 
App.use((req,res,next)=>{
req.resTime=new Date().toISOString();
console.log(req);  
next(); 
});    
 



App.use(helmet.contentSecurityPolicy({
    directives: {
        baseUri: ["'self'"],
        defaultSrc: ["'self'", 'http:', 'https:', 'ws:', 'blob:', 'data:'],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: ["'self'", 'https:', 'blob:'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        upgradeInsecureRequests: []
    }
}));



// Limit requests from same IP
const limiter = rateLimit({
    max: 100, //Amount of requests allowed
    windowMs: 60 * 60 * 100, //Time interval per allowed requested
    message: 'Too many requests, please try again in 1 hour'
});
App.use('/api', limiter);
 
// Body parser, reading data from body into req.body
App.use(express.json({ limit: '10kb' }));
App.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization (NoSQL Injection)
App.use(mongoSanitize());

// Data sanitization (XSS Injection)
App.use(xss());

// Prevent parameter pollution
App.use(hpp({
    whitelist: [
        'duration',
        'ratingsAverage',
        'ratingsQuantity',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));


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