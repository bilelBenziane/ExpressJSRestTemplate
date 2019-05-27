const express = require('express');

const app = express();

const morgan = require('morgan'); //  logging lib for logging requests

// body parseer already included in this express version
//  const bodyParser = require('body-parser'); 

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//  app.use(bodyParser.urlencoded({ extended: false }));
//  app.use(bodyParser.json());

//  route switch to handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

//  Handle requests errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

//  Handle all typoes of errors such as DB errors...
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
