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
   * Returns a list of all mensa locations. 
   * Use ?include=
   *  - menu: include today's menu data.
   */
  async getMensas(c: AppContext) {
    const supabase = getSupabase(c.env);
    const kv = c.env.MENSA_APP_CACHE;

    const includeMenu = c.req.query('include') === 'menu';

    const mensas = includeMenu
      ? await mensaService.getAllMensasWithMenu(supabase, kv)
      : await mensaService.getAllMensas(supabase, kv);

    return c.json(successResponse(mensas));
  },

  /**
   * Fetches the current menu for a specific mensa using its slug.
   */
  async getMenuBySlug(c: AppContext) {
    const supabase = getSupabase(c.env);
    const kv = c.env.MENSA_APP_CACHE;
    
    const slug = c.req.param('slug');
    if (!slug) throw new HTTPException(400, { message: 'Missing slug parameter' });

    const menu = await mensaService.getMensaMenuBySlug(supabase, slug, kv);

    return c.json(successResponse(menu));
  },

  async syncMenus(c: AppContext) {
    const config = getConfig(c.env);
    const supabase = getSupabase(c.env);
    const kv = c.env.MENSA_APP_CACHE;

    await scanService.scanAllAndSync(supabase, config.scraper, kv);
    return c.json(successResponse);
  }
};
