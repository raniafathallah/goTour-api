const mongoose = require('mongoose');
const dotenv = require('dotenv');
const App =require('./app');

// App.use(express.json())
dotenv.config();
 

// SERVER STARTER
const port = process.env.PORT || 8000;
const server = App.listen(port, () => {
    console.log(`<--- App running on ${process.env.NODE_ENV} (Port: ${port}) --->`);
});
