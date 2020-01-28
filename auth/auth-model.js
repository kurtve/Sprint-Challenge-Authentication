// helper functions for our database model go here
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/dbConfig.js');
const secrets = require('../config/secrets.js');

// get a list of all users
async function find() {
  return db('users').select('id', 'username');
}

// get a list of users matching a filter criteria
function findBy(filter) {
  return db('users')
    .where(filter)
    .select('id', 'username', 'password');
}

// get a single user with the given id
async function findById(id) {
  return db('users')
    .where({ id })
    .select('id', 'username', 'password')
    .first();
}

// add a user after hashing the user password
async function add(user) {
  user.password = await bcrypt.hash(user.password, secrets.HASH_ROUNDS);
  const [id] = await db('users').insert(user);
  return findById(id);
}

// check if a user is valid based on username and password
async function isValidUser(user) {
  try {
    let isValid = false;

    if (user.username && user.password) {
      const dbUser = await findBy({ username: user.username }).first();
      isValid = await bcrypt.compare(user.password, dbUser.password);
    }

    return isValid;
  } catch (err) {
    return false;
  }
}

// check if a token is valid
function decodeToken(token) {
  try {
    const decoded = jwt.verify(token, secrets.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
}

// generate a new token for a user
function makeToken(user) {
  const payload = {
    subject: 'user-credentials',
    username: user.username,
    role: 'user',
  };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secrets.JWT_SECRET, options);
}

module.exports = {
  add,
  find,
  findBy,
  findById,
  isValidUser,
  makeToken,
  decodeToken,
};
