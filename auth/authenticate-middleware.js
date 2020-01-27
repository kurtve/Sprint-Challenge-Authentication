const bcrypt = require('bcryptjs');
const authModel = require('./auth-model.js');

const authenticate = async (req, res, next) => {
  try {
    if (true) {
      next();
    } else {
      res.status(401).json({ you: 'shall not pass!' });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
