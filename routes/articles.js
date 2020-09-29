const httpStatus = require('http-status-codes').StatusCodes;
const router = require('express').Router();
const mongoose = require('../database/db');
const Article = require('../models/article');

/**
 * @swagger
 * /articles:
 *    get:
 *      description: This should create articles
 */
router.post('/', async (req, res) => {
  try {
    const result = await Article.insertMany(req.body);
    res.status(200).json({ data: result, errors: null, code: 200 });
  } catch (err) {
    res.status(400).json({ data: null, errors: err.message, code: 400 });
  }

});

/**
 * @swagger
 * /articles/:id:
 *    get:
 *      description: This should return all articles by id
 */
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id.trim()) || !req.params.id.trim() || req.params.id === '') {
    res.status(400).json({ error: `The user with article id ${req.params.id} not found` });
    return;
  }

  try {
    const r = await Article.findById(req.params.id.trim());
    if (!r) {
      res.status(404).json({ error: `The user with article id ${req.params.id} not found` });
    } else {
      res.status(200).json({ data: r, errors: null, code: 200 });
    }
  } catch (error) {
    res.status(500).json({ data: null, errors: error.message, code: 500 });
  }
});

/**
 * @swagger
 * /articles/user/:id:
 *    get:
 *      description: This should return all articles by profileId
 */
router.get('/user/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id.trim()) || !req.params.id.trim() || req.params.id === '') {
    res.status(400).json({ error: `The user with article id ${req.params.id} not found` });
    return;
  }

  try {

    const result = await Article.find({ profileId: req.params.id.trim() });

    if (result && result.length > 0) {
      res.status(200).json({ data: result, errors: null, code: 200 });
    }
    else {
      res.status(404).json({ error: `The user with article id ${req.params.id} not found` });
    }

  } catch (error) {
    res.status(500).json({ data: null, errors: error.message, code: 400 });
  }
});

/**
 * @swagger
 * /articles:
 *    post:
 *      description: This should return all articles
 */
router.get('/', async (req, res) => {
  try {
    const result = await Article.find({});
    res.status(200).json({ data: result, errors: null, code: 200 });

  } catch (error) {
    res.status(400).json({ data: null, errors: error, code: 400 });

  }
});

/**
 * @swagger
 * /articles/:id:
 *    delete:
 *      description: This should delete articles by id
 */
router.delete('/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with article id ${req.params.id} not found` });
    return;
  }

  Article.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(404).json({ error: `The user with article id ${req.params.id} not found` });
      } else {
        res.status(200).json({ data: doc, errors: null, code: 200 });
      }
    } else res.status(500).json({ data: null, errors: err.message, code: 500 });
  });
});

/**
 * @swagger
 * /articles/:id:
 *    put:
 *      description: This should update all articles by id
 */
router.put('/:id', (req, res) => {
  const article = {
    name: req.body.name,
    description: req.body.description,
    profileId: req.body.profileId,
  };
  if (!mongoose.Types.ObjectId.isValid(req.params.id) || !req.params.id || req.params.id === '') {
    res.status(400).json({ error: `The user with article id ${req.params.id} not found` });
    return;
  }

  Article.findByIdAndUpdate(req.params.id, article,
    { new: true, runValidators: true },
    (err, doc) => {
      if (!err) {
        if (!doc) {
          res.status(404).json({ error: `The user with article id ${req.params.id} not found` });
        } else {
          res.status(httpStatus.OK).json({ data: doc, errors: null, code: httpStatus.OK });
        }
      } else {
        res.status(400).json(
          { data: null, errors: err.message, code: httpStatus.BAD_REQUEST },
        );
      }
    });
});

module.exports = router;
