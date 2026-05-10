import { mensaService } from '../services/mensa.service';
import { successResponse } from '../core/response';
import { HTTPException } from 'hono/http-exception';
import { scanService } from '../services/scan.service';
import { getSupabase } from '../core/supabase';
import { getConfig } from '../core/config';
import type { AppContext } from '../app';

/**
 * Handlers for mensas and their current menu data.
 */
export const mensaController = {
  /**
   * Returns a list of all mensa locations without current menu data. 
   */
  async getAllMensas(c: AppContext) {
    const supabase = getSupabase(c.env);
    const kv = c.env.MENSA_APP_CACHE;

    const mensas = await mensaService.getAllMensas(supabase, kv);

    return c.json(successResponse(mensas));
  },

  /**
   * Fetches a specific mensa with its current menu data using its slug.
   */
  async getMensaWithMenuBySlug(c: AppContext) {
    const supabase = getSupabase(c.env);
    const kv = c.env.MENSA_APP_CACHE;

    const slug = c.req.param('slug');
    if (!slug) throw new HTTPException(400, { message: 'Missing slug parameter' });

    const menu = await mensaService.getMensaWithMenuBySlug(supabase, slug, kv);

    return c.json(successResponse(menu));
  },

  async syncMenus(c: AppContext) {
    const supabase = getSupabase(c.env);
    const kv = c.env.MENSA_APP_CACHE;

    const rawResults = await c.req.json();

    if (!Array.isArray(rawResults)) throw new HTTPException(400, { message: 'Invalid payload: Expected an array of menus' });

    console.log(`Received: ${rawResults.length} menus from scraper. Starting sync...`);

    await scanService.applySync(supabase, rawResults, kv);

    return c.json(successResponse({
      processed: rawResults.length,
      timestamp: new Date().toISOString()
    }));
  },
  
  async debugMockSync(c: AppContext) {
    const supabase = getSupabase(c.env);
    const kv = c.env.MENSA_APP_CACHE;
    const mockData = await c.req.json();

    await scanService.applySync(supabase, mockData, kv);
    return c.json(successResponse({ processed: mockData.length }));
  }
};
