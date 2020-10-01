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
    res.status(httpStatus.OK).json({ data: result, errors: null, code: httpStatus.OK });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      { data: null, errors: err.message, code: httpStatus.INTERNAL_SERVER_ERROR },
    );
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
    res.status(httpStatus.BAD_REQUEST).json({ error: `The article id ${req.params.id} is not found` });
    return;
  }

  try {
    const result = await Article.findById(req.params.id.trim());
    if (result) {
      res.status(httpStatus.OK).json({ data: result, errors: null, code: httpStatus.OK });
    } else {
      res.status(httpStatus.NOT_FOUND).json({ data: null, error: `The article id ${req.params.id} is not found`, code: httpStatus.NOT_FOUND });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      { data: null, errors: error.message, code: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
});

/**
 * @swagger
 * /articles/profile/:id:
 *    get:
 *      description: This should return all articles by profileId
 */
router.get('/profile/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id.trim()) || !req.params.id.trim() || req.params.id === '') {
    res.status(httpStatus.BAD_REQUEST).json({ error: `The article with profile id ${req.params.id} is not found` });
    return;
  }

  try {
    const result = await Article.find({ profileId: req.params.id.trim() });
    if (result && result.length > 0) {
      res.status(httpStatus.OK).json({ data: result, errors: null, code: httpStatus.OK });
    } else {
      res.status(httpStatus.NOT_FOUND).json({ error: `The article with profile id ${req.params.id} is not found` });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      { data: null, errors: error.message, code: httpStatus.INTERNAL_SERVER_ERROR },
    );
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
    res.status(httpStatus.OK).json({ data: result, errors: null, code: httpStatus.OK });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      { data: null, errors: error, code: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
});

/**
 * @swagger
 * /articles/:id:
 *    delete:
 *      description: This should delete articles by id
 */
router.delete('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id.trim()) || !req.params.id.trim() || req.params.id === '') {
    res.status(httpStatus.BAD_REQUEST).json({ error: `The article id ${req.params.id} is not found` });
    return;
  }
  try {
    const result = await Article.findByIdAndDelete(req.params.id.trim());
    if (!result) {
      res.status(httpStatus.NOT_FOUND).json({ error: `The article id ${req.params.id} is not found` });
    } else {
      res.status(httpStatus.OK).json({ data: result, errors: null, code: httpStatus.OK });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      { data: null, errors: error.message, code: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
});

/**
 * @swagger
 * /articles/:id:
 *    put:
 *      description: This should update all articles by id
 */
router.put('/:id', async (req, res) => {
  const article = {
    name: req.body.name,
    description: req.body.description,
    profileId: req.body.profileId,
  };
  if (!mongoose.Types.ObjectId.isValid(req.params.id.trim()) || !req.params.id.trim() || req.params.id === '') {
    res.status(httpStatus.BAD_REQUEST).json({ error: `The article id ${req.params.id} is not found` });
    return;
  }
  try {
    const result = await Article.findByIdAndUpdate(req.params.id.trim(), article,
      { new: true, runValidators: true });
    if (!result) {
      res.status(httpStatus.NOT_FOUND).json({ error: `The article id ${req.params.id} is not found` });
    } else {
      res.status(httpStatus.OK).json({ data: result, errors: null, code: httpStatus.OK });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      { data: null, errors: error.message, code: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
});

module.exports = router;
