import { Hono } from 'hono';
import { mensaController } from '../controllers/mensa.controller';

const mensaRouter = new Hono();

mensaRouter.get('/', mensaController.getAllMensas);
mensaRouter.get('/:slug', mensaController.getMensaWithMenuBySlug);

mensaRouter.post('/sync', mensaController.syncMenus);

// Debug route
mensaRouter.post('/debug/mock-sync', mensaController.debugMockSync);

export default mensaRouter;
