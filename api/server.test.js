const supertest = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig.js');

// we don't have seeds but empty out the users db before testing
(async () => {
  await db('users').truncate();
})();

// try to get jokes without a JWT
test('unauthorized jokes endpoint', async () => {
  // try the endpoint
  const res = await supertest(server).get('/api/jokes');
  // should get a 401 return code
  expect(res.status).toBe(401);
  // with a json error message
  expect(res.type).toBe('application/json');
  expect(res.body.you).toMatch(/shall not pass/i);
});

// try to get jokes with a JWT
test('authorized jokes endpoint', async () => {
  // try the endpoint
  const res = await supertest(server)
    .get('/api/jokes')
    .set(
      'Authorization',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoidXNlci1jcmVkZW50aWFscyIsInVzZXJuYW1lIjoiSmFuZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNTgwMDg3Njc4LCJleHAiOjE1ODAxNzQwNzh9.MWYuk80wcdGI87YyiJyLYuky-QaZjGp3c3j19HqAqJE'
    );
  // should get a 200 return code
  expect(res.status).toBe(200);
  // with a json message
  expect(res.type).toBe('application/json');
  // array of length 20
  expect(res.body.length).toBe(20);
  // first element is an object with an id and a joke
  expect(res.body[0]).toHaveProperty('id');
  expect(res.body[0]).toHaveProperty('joke');
});

// attempt login before registering
test('invalid login endpoint', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/auth/login')
    .send({ username: 'joe', password: 'joe' });
  // should get a 200 return code
  expect(res.status).toBe(401);
  // with a json message
  expect(res.type).toBe('application/json');
  // body has 'invalid' message
  expect(res.body.message).toMatch(/invalid/i);
});

// attempt to register
test('register endpoint', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/auth/register')
    .send({ username: 'joe', password: 'joe' });
  // should get a 201 return code
  expect(res.status).toBe(201);
  // with a json message
  expect(res.type).toBe('application/json');
  // body has user id and username
  expect(res.body).toHaveProperty('id', 1);
  expect(res.body).toHaveProperty('username', 'joe');
});

// attempt to login after registering
test('good login endpoint', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/auth/login')
    .send({ username: 'joe', password: 'joe' });
  // should get a 200 return code
  expect(res.status).toBe(200);
  // with a json message
  expect(res.type).toBe('application/json');
  // body has welcome message
  expect(res.body.message).toMatch(/welcome/i);
});

// attempt to register again with same user - should fail
test('invalid register endpoint', async () => {
  // try the endpoint
  const res = await supertest(server)
    .post('/api/auth/register')
    .send({ username: 'joe', password: 'joe' });
  // should get a 400 return code
  expect(res.status).toBe(400);
  // with a json message
  expect(res.type).toBe('application/json');
  // body has 'not available' message
  expect(res.body.message).toMatch(/not available/i);
});
