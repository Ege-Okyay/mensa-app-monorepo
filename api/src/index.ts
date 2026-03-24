import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { config } from './core/config.js';
import { logger } from 'hono/logger';
import { errorResponse } from './core/response.js';
import mensaRouter from './routes/mensa.routes.js';

const app = new Hono();

app.use('*', logger());

app.route('/mensa', mensaRouter);

app.onError((err, c) => {
  const { response, status } = errorResponse(err);
  
  return c.json(response, status);
});

serve({
  fetch: app.fetch,
  port: config.port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
  console.log('---Active Routes---');

  app.routes.forEach((route) => {
    console.log(`${route.method.padEnd(7)} ${route.path}`);
  });

  console.log('-------------------\n');
});
