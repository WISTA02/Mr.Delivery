'use strict';


const { db } = require('../src/models/index.model');
const supertest = require('supertest');
const server = require('../src/server.js').server;
const mockRequest = supertest(server);

process.env.SECRET = "TEST_SECRET";


let userData = {
  testUser: { username: 'user', password: 'password', role: "admin" },
};
let accessToken = null;

beforeAll(async () => {
  await db.sync();
});


describe('Auth Router', () => {
  it('Should respond with 404 status on an invalid route', async () => {
    const response = await mockRequest.get('/abc');
    expect(response.status).toBe(404);
  });
  it('Can create a new user', async () => {
    const response = await mockRequest.post('/signup').send(userData.testUser);
    expect(response.status).toBe(201);
  });

  it('Can signin with basic auth string', async () => {
    let { username, password } = userData.testUser;

    const response = await mockRequest.post('/signin')
      .auth(username, password);
    expect(response.status).toBe(200);
  });
  it('basic fails with known user and wrong password ', async () => {
    const response = await mockRequest.post('/signin')
      .auth('admin', 'xyz')
    expect(response.status).toBe(403);
  });

  it('basic fails with unknown user', async () => {
    const response = await mockRequest.post('/signin')
      .auth('nobody', 'xyz')
    expect(response.status).toBe(403);
  });

  it('bearer fails with an invalid token', async () => {
    const response = await mockRequest.get('/users')
      .set('Authorization', `Bearer foobar`)
    const userList = response.body;
    expect(response.status).toBe(403);
    expect(response.text).toEqual("Invalid Signin");
  });

  it('Secret Route fails with invalid token', async () => {
    const response = await mockRequest.get('/secret')
      .set('Authorization', `bearer accessgranted`);

    expect(response.status).toBe(403);
  });
  afterAll(async () => {
    await db.drop();
  });
});
