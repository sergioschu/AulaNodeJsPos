const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        console.log('Connected to MongoDB!!!')
    });

require('./api/models/product');
require('./api/models/order');
require('./api/models/user');

const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./api/config/passport')(passport);
app.use(passport.initialize());

let cors = (req, res, next) => {
    const whitelist = [
        'http://localhost:8080'
    ];
    const origin = req.header.origin;
    if ((whitelist.indexOf(origin)) > -1) {
        res.setHeader('Access-Control-Allow-Origin', '*');

    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'token,Content-Type,Authorization,x-acess-token');
    next();
}
app.use(cors);

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use('/api', (req, res, next) => {
    res.status(200).json({
        message: 'Hello Word!',
        body: req.body
    })
});

app.use((req, res, next) => {
    const error = new Error(req.path + ' Not Found')
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;