/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

const router = express.Router();

router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => ({
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${doc._id}`,
          },
        })),
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order
        .save();
    }).then((result) => {
      res.status(201).json({
        message: 'Order Stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: 'GET',
          url: `http:/localhost:3000/orders/${result._id}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then((order) => {
      if (!order) {
        res.status(404).json({
          message: 'Order not found',
        });
      }
      res.status(200).json({
        order,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders',
        },
      });
    })
    .catch();
});

router.delete('/:orderId', (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Deleted order',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: { peoductId: 'ID', quantity: 'Number' },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
  res.status(200).json({
    messgae: 'Order deleted',
    orderId: req.params.orderId,
  });
});

module.exports = router;
