const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET request to Products',
  });
});

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product.save()
    .then(
      (result) => {
        console.log('passed : '+result);
      },
    )
    .catch(
      (err) => {
        console.log('error : '+err);
      },
    );
  res.status(201).json({
    message: 'Handling POST request to Products',
    product,
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if (id === 'special') {
    res.status(200).json({
      message: 'You discovered the spicial ID',
    });
  } else {
    res.status(200).json({
      messgae: 'You passe ID',
    });
  }
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product',
  });
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted product',
  });
});

module.exports = router;
