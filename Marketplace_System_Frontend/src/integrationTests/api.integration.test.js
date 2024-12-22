import request from 'supertest';
import app from '../App'; // Adjust the path to your app

describe('API Endpoints', () => {
  test('GET /shops', async () => {
    const response = await request(app).get('/shops').set('Authorization', 'Bearer your_token_here');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('POST /shops', async () => {
    const response = await request(app)
      .post('/shops')
      .set('Authorization', 'Bearer your_token_here')
      .send({ name: 'Test Shop', description: 'Test Description' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Test Shop');
  });
});
