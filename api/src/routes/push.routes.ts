import { Hono } from 'hono';
import { pushController } from '../controllers/push.controller';
import type { Env } from '../core/config';
import { rateLimiter } from 'hono-rate-limiter';

const pushRouter = new Hono<{ Bindings: Env }>();

const pushRateLimit = rateLimiter<{ Bindings: Env }>({
  binding: (c) => c.env.PUSH_RATE_LIMITER,
  keyGenerator: (c) =>
    c.req.header('cf-connecting-ip') ||
    c.req.header('x-forwarded-for') ||
    'push-spam'
});

pushRouter.post('/subscribe', pushRateLimit, pushController.subscribe);
pushRouter.post('/unsubscribe', pushRateLimit, pushController.unsubscribe);

export default pushRouter;
