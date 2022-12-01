const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app=require('express')();

dotenv.config();
 

// SERVER STARTER
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`<--- App running on ${process.env.NODE_ENV} (Port: ${port}) --->`);
});
