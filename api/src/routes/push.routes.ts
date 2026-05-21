import { Hono } from 'hono';
import { pushController } from '../controllers/push.controller';

const pushRouter = new Hono();

pushRouter.post('/subscribe', pushController.subscribe);
pushRouter.post('/unsubscribe', pushController.unsubscribe);

export default pushRouter;
