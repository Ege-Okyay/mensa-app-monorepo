import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { config } from './core/config.js';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';

const app = new Hono();

app.use('*', logger());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      error: err.message,
      code: err.status
    }, err.status);
  }

  console.error(err);
  
  return c.json({
    success: false,
    error: 'Internal Server Error',
    code: 500,
  }, 500);
});

serve({
  fetch: app.fetch,
  port: config.port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
