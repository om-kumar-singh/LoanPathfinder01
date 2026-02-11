require('dotenv').config();
const request = require('supertest');
const app = require('../app');

describe('GET /api/health', () => {
  it('returns 200 and success true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns message and timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.message).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });

  it('includes database status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.database).toBeDefined();
    expect(res.body.database.status).toBeDefined();
  });
});
