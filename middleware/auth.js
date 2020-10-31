const jwt = require('jsonwebtoken');

const { jwtKey } = process.env;
const httpStatus = require('http-status-codes').StatusCodes;

const Authenticate = (req, res, next) => {
  jwt.verify(req.headers.authorization, jwtKey, (err, decoded) => {
    if (err) {
      res.status(httpStatus.UNAUTHORIZED).json(
        { data: null, errors: err.message, code: httpStatus.UNAUTHORIZED },
      );
    } else {
      req.user = decoded.email;
      next();
    }
  });
};

module.exports = Authenticate;
