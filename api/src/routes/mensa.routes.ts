import { Hono, type Next } from 'hono';
import { mensaController } from '../controllers/mensa.controller';
import type { AppContext } from '../app';

const mensaRouter = new Hono();

const scraperKeyMiddleware = async (c: AppContext, next: Next) => {
  const incomingKey = c.req.header('X-Internal-Key');
  const expectedKey = c.env.SCRAPER_KEY;

  if (!incomingKey || incomingKey !== expectedKey) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  return next();
};

mensaRouter.get('/', mensaController.getAllMensas);
mensaRouter.get('/scraped-status', scraperKeyMiddleware, mensaController.getScrapedStatus);
mensaRouter.get('/:slug', mensaController.getMensaWithMenuBySlug);

mensaRouter.post('/sync', scraperKeyMiddleware, mensaController.syncMenus);
mensaRouter.post('/clear', scraperKeyMiddleware, mensaController.clearMenus);

// Debug route
mensaRouter.post('/debug/mock-sync', mensaController.debugMockSync);

export default mensaRouter;
