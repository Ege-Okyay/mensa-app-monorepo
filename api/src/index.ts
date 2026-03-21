import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { config } from './core/config.js';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());

serve({
  fetch: app.fetch,
  port: config.port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
