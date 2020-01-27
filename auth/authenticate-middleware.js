const bcrypt = require('bcryptjs');
const authModel = require('./auth-model.js');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let decoded;
    if (token) {
      decoded = authModel.decodeToken(token);
    }
    if (!decoded) {
      res.status(401).json({ you: 'shall not pass!' });
    } else {
      req.username = decoded.username;
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
