const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Profile = require('../models/profile');
const mongoose = require('../database/db');

router.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      res.status(400).json({ data: null, errors: 'Profile validation failed: password: Path `password` is required.', code: 400 });
    } else {
      const profile = new Profile({
        name: req.body.name,
        country: req.body.country,
        age: req.body.age,
        sex: req.body.sex,
        email: req.body.email,
        password: hash,
      });

      try {
        const result = await profile.save();
        res.status(201).json({ data: result, errors: null, code: 201 });
      } catch (error) {
        res.status(400).json({
          data: null,
          errors: error.message.includes('duplicate')
            ? `Duplicate email exists '${req.body.email}'` : error.message,
          code: 400,
        });
      }
    }
  });
});

router.post('/signin', (req, res) => {
  Profile.findOne({ email: req.body.email }, async (error, result) => {
    if (!result || error) {
      res.status(400).json({ data: null, errors: 'Incorrect email or password', code: 400 });
    } else {
      const isValid = await bcrypt.compare(req.body.password, result.password);
      if (isValid) {
        res.status(200).json({ data: isValid, errors: null, code: 200 });
      } else {
        res.status(400).json({ data: null, errors: 'Incorrect email or password', code: 400 });
      }
    }
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
  } else {
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
  }
});

module.exports = router;
