const router = require('express').Router();
const Order = require('../models/order');
const mongoose = require('../database/db');
const authenticate = require('../middleware/auth');

router.post('/', authenticate, (req, res) => {
  const orders = [];
  req.body.forEach((element) => {
    const order = new Order({
      productId: element.productId,
      price: element.price,
      profileId: element.profileId,
    });

    orders.push(order);
  });

  Order.create(orders, (err, doc) => {
    if (!err) {
      res.status(200).json({ data: doc, errors: null, code: 200 });
    } else {
      res.status(400).json({ data: null, errors: err.message, code: 400 });
    }
  });
});

router.get('/:id', authenticate, (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with order id ${req.params.id} not found` });
    return;
  }

  Order.findById(req.params.id, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(404).json({ error: `The user with order id ${req.params.id} not found` });
      } else {
        res.status(200).json({ data: doc, errors: null, code: 200 });
      }
    } else res.status(400).json({ data: null, errors: err.message, code: 400 });
  });
});

router.get('/', authenticate, (req, res) => {
  Order.find({})
    .populate('productId')
    .populate('profileId')
    .exec((err, docs) => {
      if (!err) {
        res.status(200).json({ data: docs, errors: null, code: 200 });
      } else {
        res.status(400).json({ data: null, errors: err.message, code: 400 });
      }
    });
});

router.delete('/:id', authenticate, (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with order id ${req.params.id} not found` });
    return;
  }

  Order.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(404).json({ error: `The user with order id ${req.params.id} not found` });
      } else {
        res.status(200).json({ data: doc, errors: null, code: 200 });
      }
    } else res.status(400).json({ data: null, errors: err.message, code: 400 });
  });
});

router.put('/:id', authenticate, (req, res) => {
  const order = {
    productid: req.body.productid,
    price: req.body.price,
    profileId: req.body.profileId,
  };
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with order id ${req.params.id} not found` });
    return;
  }

  order.findByIdAndUpdate(req.params.id, order, { new: true, runValidators: true }, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(404).json({ error: `The user with order id ${req.params.id} not found` });
      } else {
        res.status(200).json({ data: doc, errors: null, code: 200 });
      }
    } else res.status(400).json({ data: null, errors: err.message, code: 200 });
  });
});

router.get('/user/:id', authenticate, (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with order id ${req.params.id} not found` });
    return;
  }

  Order.find({ profileId: req.params.id }, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(404).json({ error: `The user with order id ${req.params.id} not found` });
      } else {
        res.status(200).json({ data: doc, errors: null, code: 200 });
      }
    } else res.status(400).json({ data: null, errors: err.message, code: 400 });
  });
});

module.exports = router;
