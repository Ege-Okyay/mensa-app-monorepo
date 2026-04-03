import { Hono } from 'hono';
import { mensaController } from '../controllers/mensa.controller';

const mensaRouter = new Hono();

mensaRouter.get('/', mensaController.getMensas);
mensaRouter.get('/menu/:slug', mensaController.getMenuBySlug);

// Debug route
mensaRouter.post('/debug/sync', mensaController.syncMenus);

export default mensaRouter;
