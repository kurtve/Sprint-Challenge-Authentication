const router = require('express').Router();
const authModel = require('./auth-model.js');

router.post('/register', async (req, res, next) => {
  // register a new user
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({
        message: 'You must supply a username and a password',
      });
    } else {
      const saved = await authModel.add({
        username: req.body.username,
        password: req.body.password,
      });
      res.status(201).json({ id: saved.id, username: saved.username });
    }
  } catch (err) {
    if (err.message.includes('SQLITE_CONSTRAINT: UNIQUE')) {
      res
        .status(400)
        .json({ message: `Username ${req.body.username} is not available` });
    } else {
      next(err);
    }
  }
});

router.post('/login', async (req, res, next) => {
  // implement login
});

module.exports = router;
