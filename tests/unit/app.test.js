const request = require('supertest');
const app = require('../../src/app.js');  // Assuming your app file is in a parent directory

describe('404 Handler', () => {
  it('should return a 404 status and error message', async () => {
    const response = await request(app).get('/nonexistent-route');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
