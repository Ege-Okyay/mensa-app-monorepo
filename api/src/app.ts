import { Hono } from 'hono';
import { logger } from 'hono/logger';
import mensaRouter from './routes/mensa.routes.js';
import { errorResponse } from './core/response.js';

const app = new Hono()
  .use('*', logger())
  .route('/mensa', mensaRouter);

app.onError((err, c) => {
  const { response, status } = errorResponse(err);
  return c.json(response, status);
});

export type AppType = typeof app;
export default app;
