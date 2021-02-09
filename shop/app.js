const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/orders');
const mongoose = require('mongoose');
const userRoutes = require('./api/routes/user');

mongoose.connect('connection to database' + process.env.MONGO_ATLAS_PW + 'continue of connection',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
mongoose.Promise = global.Promise;
//for logging
app.use(morgan('dev'));
//you can also make a route for /uploads and do it manually or u can do 
//a middleware to make uploads public
app.use('/uploads', express.static('uploads')); //if it has/uploads apply the following middlweare so it ignores /uploads
//to extract the json from url when sending post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//allowing CORS
app.use((req, res, next) => {
    //you can restrict it for your own domain but * means everything
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With, Content-Type, Accept, Authorization"
    );
    //because the browser sends first an option method to check if allowed, then the crud requests
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    //so other routes can take over
    next();
});

//routing
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//for error handling 404
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//for handling errors from db or any other error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;