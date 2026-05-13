import { type Context, Hono } from 'hono';
import mensaRouter from './routes/mensa.routes';
import { errorResponse } from './core/response';
import type { Env } from './core/config';
import { rateLimiter } from 'hono-rate-limiter';
import { cors } from 'hono/cors'; 

const app = new Hono<{ Bindings: Env }>();

// TODO: add the prod URL
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://mensa-app-test.pages.dev'],
  // origin: '*', // DEV Mode ONLY
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}));

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
