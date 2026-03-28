import { serve } from '@hono/node-server';
import { config } from './core/config.js';
import app from './app.js';

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
