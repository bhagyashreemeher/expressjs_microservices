const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status-codes").StatusCodes;
const Profile = require("../models/profile");
const mongoose = require("../database/db");
const authenticate = require("../middleware/auth");

const { jwtKey } = process.env;

router.post("/signup", async (req, res) => {
  const profile = new Profile({
    name: req.body.name,
    country: req.body.country,
    age: req.body.age,
    sex: req.body.sex,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const result = await profile.save();
    res
      .status(httpStatus.CREATED)
      .json({ data: result, errors: null, code: httpStatus.CREATED });
  } catch (error) {
    res.status(httpStatus.CONFLICT).json({
      data: null,
      errors: error.message.includes("duplicate")
        ? `Duplicate email exists '${req.body.email}'`
        : error.message,
      code: httpStatus.CONFLICT,
    });
  }
});

router.post("/signin", (req, res) => {
  Profile.findOne({ email: req.body.email }, async (error, result) => {
    if (!result || error) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({
          data: null,
          errors: "Incorrect email or password",
          code: httpStatus.BAD_REQUEST,
        });
    } else {
      const isValid = await bcrypt.compare(req.body.password, result.password);
      if (isValid) {
        const jtoken = jwt.sign(
          {
            email: req.body.email,
          },
          jwtKey,
          {
            expiresIn: "1h",
          }
        );
        res.status(httpStatus.OK).json({
          data: isValid,
          errors: null,
          code: httpStatus.OK,
          jtoken,
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).json({
          data: null,
          errors: "Incorrect email or password",
          code: httpStatus.BAD_REQUEST,
        });
      }
    }
  });
});

router.get("/:id", authenticate, (req, res) => {
  if (
    !mongoose.Types.ObjectId.isValid(req.params.id) ||
    !req.params.id ||
    req.params.id === ""
  ) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: `The user with profile id ${req.params.id} not found` });
    return;
  }

  Profile.findById(req.params.id, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(httpStatus.NOT_FOUND).json({
          error: `The user with article id ${req.params.id} not found`,
        });
      } else {
        res.status(httpStatus.OK).json({ data: doc, errors: null, code: httpStatus.OK });
      }
    } else res.status(httpStatus.BAD_REQUEST).json({ data: null, errors: err.message, code: httpStatus.BAD_REQUEST });
  });
});

router.delete("/:id", authenticate, (req, res) => {
  if (
    !mongoose.Types.ObjectId.isValid(req.params.id) ||
    !req.params.id ||
    req.params.id === ""
  ) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: `The user with article id ${req.params.id} not found` });
    return;
  }

  Profile.findByIdAndDelete(req.params.id, (err, doc) => {
    if (!err) {
      if (!doc) {
        res.status(httpStatus.NOT_FOUND).json({
          error: `The user with article id ${req.params.id} not found`,
        });
      } else {
        res.status(httpStatus.OK).json({ data: doc, errors: null, code: httpStatus.OK });
      }
    } else res.status(httpStatus.BAD_REQUEST).json({ data: null, errors: err.message, code: httpStatus.BAD_REQUEST });
  });
});

router.get("/", authenticate, (req, res) => {
  Profile.find({}, (err, doc) => {
    if (!err) {
      res.status(httpStatus.OK).json({ data: doc, errors: null, code: httpStatus.OK });
    } else res.status(httpStatus.BAD_REQUEST).json({ data: null, errors: err, code: httpStatus.BAD_REQUEST });
  });
});

router.put("/:id", authenticate, (req, res) => {
  const profile = {
    name: req.body.name,
    country: req.body.country,
    sex: req.body.sex,
    email: req.body.email,
    age: req.body.age,
  };

  if (
    !mongoose.Types.ObjectId.isValid(req.params.id) ||
    !req.params.id ||
    req.params.id === ""
  ) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: `The user with article id ${req.params.id} not found` });
  } else {
    Profile.findByIdAndUpdate(
      req.params.id,
      profile,
      { new: true, runValidators: true },
      (err, doc) => {
        if (!err) {
          if (!doc) {
            res.status(httpStatus.NOT_FOUND).json({
              error: `The user with article id ${req.params.id} not found`,
            });
          } else {
            res.status(httpStatus.OK).json({ data: doc, errors: null, code: httpStatus.OK });
          }
        } else
          res.status(httpStatus.BAD_REQUEST).json({ data: null, errors: err.message, code: httpStatus.OK });
      }
    );
  }
});

module.exports = router;
