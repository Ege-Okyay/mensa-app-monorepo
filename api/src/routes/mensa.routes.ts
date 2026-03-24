import { Hono } from 'hono';
import { mensaController } from '../controllers/mensa.controller.js';

const mensaRouter = new Hono();

mensaRouter.get('/', mensaController.getMensas);
mensaRouter.get('/menu/:slug', mensaController.getMenuBySlug);

export default mensaRouter;
