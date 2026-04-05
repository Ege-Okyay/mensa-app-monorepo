import { type Context, Hono } from 'hono';
import mensaRouter from './routes/mensa.routes';
import { errorResponse } from './core/response';
import type { Env } from './core/config';
import { rateLimiter } from 'hono-rate-limiter';

const app = new Hono<{ Bindings: Env }>();

app.use(
  rateLimiter<{ Bindings: Env }>({
    binding: (c) => c.env.MENSA_APP_RATE_LIMITER,
    keyGenerator: (c) =>
      c.req.header('cf-connecting-ip') ||
      c.req.header('x-forwarded-for') ||
      'global-fallback'
  })
);

app.route('/mensa', mensaRouter);

app.onError((err, c) => {
  const { response, status } = errorResponse(err);
  return c.json(response, status);
});

export type AppContext = Context<{ Bindings: Env }>;
export default app;
