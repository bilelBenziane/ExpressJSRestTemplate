const express = require('express');

const app = express();

const morgan = require('morgan'); //  logging lib for logging requests

const mongoose = require('mongoose');

// body parseer already included in this express version
//  const bodyParser = require('body-parser'); 

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

mongoose.connect(
  'mongodb://localhost/testaroo', { useNewUrlParser: true },
).then((result) => {
  console.log('connected db : '+result);
}).catch((err) =>{
  console.log('connection pb db : '+err);
}); 

app.use(morgan('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.status(200).json({});
  }
  next();
});

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
