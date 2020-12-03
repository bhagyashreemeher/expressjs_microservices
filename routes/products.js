const router = require('express').Router();
const Product = require('../models/product');
const mongoose = require('../database/db');
const authenticate = require('../middleware/auth');
const httpStatus = require("http-status-codes").StatusCodes;

router.post('/', authenticate, (req, res) => {
  Product.insertMany(req.body, (err, doc) => {
    if (!err) {
      res.status(httpStatus.OK).json({ data: doc, errors: null, code: httpStatus.OK });
    } else {
      res.status(httpStatus.BAD_REQUEST).json({ data: null, errors: err.message, code: httpStatus.BAD_REQUEST });
    }
  });
});

router.get('/:id', authenticate, (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with product id ${req.params.id} not found` });
    return;
  }

  Product.findById(req.params.id, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(404).json({ error: `The user with product id ${req.params.id} not found` });
      } else {
        res.status(200).json({ data: doc, errors: null, code: 200 });
      }
    } else res.status(400).json({ data: null, errors: err.message, code: 400 });
  });
});

router.get('/', authenticate, (req, res) => {
  Product.find({}, (err, doc) => {
    if (!err) {
      res.status(200).json({ data: doc, errors: null, code: 200 });
    } else {
      res.status(400).json({ data: null, errors: err.message, code: 400 });
    }
  });
});

router.delete('/:id', authenticate, (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with product id ${req.params.id} not found` });
    return;
  }

  Product.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(404).json({ error: `The user with product id ${req.params.id} not found` });
      } else {
        res.status(200).json({ data: doc, errors: null, code: 200 });
      }
    } else res.status(400).json({ data: null, errors: err.message, code: 400 });
  });
});

router.put('/:id', authenticate, (req, res) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    discount: req.body.discount,
  };
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with product id ${req.params.id} not found` });
    return;
  }

  Product.findByIdAndUpdate(req.params.id, product,
    { new: true, runValidators: true }, (err, doc) => {
      if (!err) {
        if (!doc) {
          res.status(404).json({ error: `The user with product id ${req.params.id} not found` });
        } else {
          res.status(200).json({ data: doc, errors: null, code: 200 });
        }
      } else res.status(400).json({ data: null, errors: err.message, code: 200 });
    });
});

module.exports = router;
