import { HTTPException } from 'hono/http-exception';
import type { AppContext } from '../app';
import { successResponse } from '../core/response';
import { getSupabase } from '../core/supabase';
import { pushService } from '../services/push.service';

/**
 * Handlers for managing and sending push notifications
 */
export const pushController = {
  async subscribe(c: AppContext) {
    const supabase = getSupabase(c.env);
    const body = await c.req.json();
    const data = await pushService.saveSubscription(supabase, body);

    return c.json(successResponse(data));
  },

  async unsubscribe(c: AppContext) {
    const supabase = getSupabase(c.env);
    const rawDto = await c.req.json();

    if (!rawDto.endpoint) throw new HTTPException(400, { message: 'Invalid payload: Expected an endpoint' });

    await pushService.deleteSubscription(supabase, rawDto.endpoint);

    return c.json(successResponse({
      processed: rawDto.endpoint,
      timestamp: new Date().toISOString()
    }));
  }
}
