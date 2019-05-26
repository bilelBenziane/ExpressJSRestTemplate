const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET request to Orders',
  });
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).json({
    message: 'Handling POST request to Orders',
    order,
  });
});

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    messgae: 'You passe ID',
    orderId: req.params.orderId,
  });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    messgae: 'Order deleted',
    orderId: req.params.orderId,
  });
});

module.exports = router;
