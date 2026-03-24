import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { config } from './core/config.js';
import { logger } from 'hono/logger';
import { errorResponse } from './core/response.js';

const app = new Hono().basePath('api');

app.use('*', logger());

app.onError((err, c) => {
  const { response, status } = errorResponse(err);
  
  return c.json(response, status);
});

serve({
  fetch: app.fetch,
  port: config.port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
