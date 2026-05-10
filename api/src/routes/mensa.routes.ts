import { Hono } from 'hono';
import { mensaController } from '../controllers/mensa.controller';
import type { AppContext } from '../app';

const mensaRouter = new Hono();

mensaRouter.get('/', mensaController.getAllMensas);
mensaRouter.get('/:slug', mensaController.getMensaWithMenuBySlug);

mensaRouter.post('/sync', async(c: AppContext, next) => {
  const incomingKey = c.req.header('X-Internal-Key');
  const expectedKey = c.env.SCRAPER_KEY;

  if (!incomingKey || incomingKey !== expectedKey) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  return next();
}, mensaController.syncMenus);

// Debug route
mensaRouter.post('/debug/mock-sync', mensaController.debugMockSync);

export default mensaRouter;
