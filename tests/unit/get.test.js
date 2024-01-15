const request = require('supertest');

const app = require('../../src/app');
const hash = require('../../src/hash');
const {Fragment} = require('../../src/model/fragment')

const resetData = async (user) => {
  const fragmentsIds = await Fragment.byUser(hash(user));

  if (fragmentsIds.length > 0) {
    fragmentsIds.forEach(async (id) => {
      await Fragment.delete(hash(user), id);
    });
  }
};

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
  
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
});
describe('GET /v1/fragments?expand=1', () => {
  // clean up after each test
  afterEach(async () => {
    await resetData('user1@email.com');
  });

  test('result should includes full representation of fragments metadata', async () => {
    const fragmentId1 = (
      await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is fragment1')
    ).body.fragment.id;

    const fragmentId2 = (
      await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send('This is fragment2')
    ).body.fragment.id;

    const res = await request(app).get('/v1/fragments?expand=1').auth('user1@email.com', 'password1');
    const resFragments = res.body.fragments;

    expect(res.statusCode).toBe(200);
    expect(resFragments[0].id).toBe(fragmentId1);
    expect(resFragments[1].id).toBe(fragmentId2);
  })});
