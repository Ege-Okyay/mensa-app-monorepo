import { config } from './core/config.js';
import app from './app.js';

console.log('---Active Routes---');

app.routes.forEach((route) => {
  console.log(`${route.method.padEnd(7)} ${route.path}`);
});

console.log('-------------------\n');

export default {
  port: config.port,
  fetch: app.fetch
};
