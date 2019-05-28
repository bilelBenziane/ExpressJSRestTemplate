const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            // eslint-disable-next-line no-underscore-dangle
            _id: doc._id,
            request: {
              type: 'GET',
              url: `http://localhost:3000/products/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
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
        res.status(201).json({
          message: 'Handling POST request to Products',
          createdProduct: {
            name: result.name,
            price: result.price,
            // eslint-disable-next-line no-underscore-dangle
            _id: result._id,
            request: {
              type: 'POST',
              url: `http://localhost:3000/products/${result._id}`,
            },
          },
        });
      },
    )
    .catch(
      (err) => {
        res.status(500).json({
          error: err,
        });
      },
    );
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          product: result,
          request: {
            type: 'GET',
            description: 'Get_All_Products',
            url: 'http://localhost:3000/products',
          },
        });
      } else {
        res.status(404).json({
          message: 'no valid entry id',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $sets: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Product Updated',
        result: {
          type: 'GET',
          url: `http://localhost:3000/products/${id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });

  res.status(200).json({
    message: 'Updated product',
  });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Product Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: { name: 'String', price: 'Number' },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
