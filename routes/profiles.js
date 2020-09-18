const router = require('express').Router();
const Profile = require('../models/profile');
const mongoose = require('../database/db');

router.post('/', (req, res) => {
  Profile.insertMany(req.body, (err, doc) => {
    if (!err) {
      res.status(200).json({ data: doc, errors: null, code: 200 });
    } else res.status(400).json({ data: null, errors: err.message, code: 400 });
  });
});

router.get('/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with profile id ${req.params.id} not found` });
    return;
  }

  Profile.findById(req.params.id, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(404).json({ error: `The user with article id ${req.params.id} not found` });
      } else {
        res.status(200).json({ data: doc, errors: null, code: 200 });
      }
    } else res.status(400).json({ data: null, errors: err.message, code: 400 });
  });
});

router.delete('/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with article id ${req.params.id} not found` });
    return;
  }

  Profile.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(404).json({ error: `The user with article id ${req.params.id} not found` });
      } else {
        res.status(200).json({ data: doc, errors: null, code: 200 });
      }
    } else res.status(400).json({ data: null, errors: err.message, code: 400 });
  });
});

router.get('/', (req, res) => {
  Profile.find({}, (err, doc) => {
    if (!err) {
      res.status(200).json({ data: doc, errors: null, code: 200 });
    } else res.status(400).json({ data: null, errors: err, code: 400 });
  });
});

router.put('/:id', (req, res) => {
  const profile = {
    name: req.body.name,
    country: req.body.country,
    sex: req.body.sex,
    email: req.body.email,
    age: req.body.age,
  };
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with article id ${req.params.id} not found` });
    return;
  }

  Profile.findByIdAndUpdate(req.params.id, profile,
    { new: true, runValidators: true }, (err, doc) => {
      if (!err) {
        if (!doc) {
          res.status(404).json({ error: `The user with article id ${req.params.id} not found` });
        } else {
          res.status(200).json({ data: doc, errors: null, code: 200 });
        }
      } else res.status(400).json({ data: null, errors: err.message, code: 200 });
    });
});

module.exports = router;
