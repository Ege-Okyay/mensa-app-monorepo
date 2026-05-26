import { expect, test } from 'bun:test';
import app from '../../src';

const mockEnv = {
  SCRAPER_KEY: 'test_key',
  GENERAL_RATE_LIMITER: { limit: async () => ({ success: true }) },
  MENSA_APP_CACHE: {}
};

test('/sync endpoint blocks requests without secret key', async () => {
  const res = await app.request('/mensa/sync', {
    method: 'POST',
    body: JSON.stringify([])
  }, mockEnv);
  expect(res.status).toBe(401);
});

test('/sync endpoint blocks requests with incorrect secret key', async () => {
  const res = await app.request('/mensa/sync', {
    method: 'POST',
    headers: { 'X-Internal-Key': 'wrong_key' },
    body: JSON.stringify([])
  }, mockEnv);
  expect(res.status).toBe(401);
});
