const jwt = require('jsonwebtoken');

const { jwtKey } = process.env;

const Authenticate = (req, res, next) => {
  jwt.verify(req.headers.authorization, jwtKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ data: null, errors: err.message, code: 401 });
    } else {
      req.user = decoded.email;
      next();
    }
  });
};

module.exports = Authenticate;
