import type { Context } from 'hono';
import { mensaService } from '../services/mensa.service.js';
import { successResponse } from '../core/response.js';
import { HTTPException } from 'hono/http-exception';
import { scanService } from '../services/scan.service.js';
import { getSupabase } from "../core/supabase.js";
import { getConfig } from "../core/config.js";

/**
 * Handlers for mensas and their current menu data.
 */
export const mensaController = {
  /**
   * Returns a list of all mensa locations. 
   * Use ?include=
   *  - menu: include today's menu data.
   */
  async getMensas(c: Context) {
    const supabase = getSupabase(c.env);

    const includeMenu = c.req.query('include') === 'menu';

    const mensas = includeMenu
      ? await mensaService.getAllMensasWithMenu(supabase)
      : await mensaService.getAllMensas(supabase);

    return c.json(successResponse(mensas));
  },

  /**
   * Fetches the current menu for a specific mensa using its slug.
   */
  async getMenuBySlug(c: Context) {
    const supabase = getSupabase(c.env);
    
    const slug = c.req.param('slug');
    if (!slug) throw new HTTPException(400, { message: 'Missing slug parameter' });

    const menu = await mensaService.getMensaMenuBySlug(supabase, slug);

    return c.json(successResponse(menu));
  },

  async syncMenus(c: Context) {
    const config = getConfig(c.env);
    const supabase = getSupabase(c.env);

    await scanService.scanAllAndSync(supabase, config.scraper);
    return c.json(successResponse);
  }
};
