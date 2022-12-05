const mongoose = require('mongoose');
const dotenv = require('dotenv');
const App =require('./app');

// App.use(express.json())
dotenv.config();

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('Shutting down program...');
    process.exit(1);
});
 
const port = process.env.PORT || 8000;

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection stablished!');
    App.listen(port, () => {
        console.log(`<--- App running on ${process.env.NODE_ENV} (Port: ${port}) --->`);
    });
    
}
);


process.on('unhandledRejection', err => {
    console.log(err.name, err.message);

    console.log('Shutting down program...');
    server.close(() => {
        process.exit(1);
    });
});
// SERVER STARTER
