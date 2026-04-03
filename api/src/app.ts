import { Hono } from 'hono';
import mensaRouter from './routes/mensa.routes';
import { errorResponse } from './core/response';

const app = new Hono()
  // .use('*', logger()) -> Wrangler has built in logger
  .route('/mensa', mensaRouter);

app.onError((err, c) => {
  const { response, status } = errorResponse(err);
  return c.json(response, status);
});

export type AppType = typeof app;
export default app;
