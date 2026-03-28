import type { Context } from 'hono';
import { mensaService } from '../services/mensa.service.js';
import { successResponse } from '../core/response.js';
import { HTTPException } from 'hono/http-exception';
import { scanService } from '../services/scan.service.js';

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
    const includeMenu = c.req.query('include') === 'menu';

    const mensas = includeMenu
      ? await mensaService.getAllMensasWithMenu()
      : await mensaService.getAllMensas();

    return c.json(successResponse(mensas));
  },

  /**
   * Fetches the current menu for a specific mensa using its slug.
   */
  async getMenuBySlug(c: Context) {
    const slug = c.req.param('slug');
    if (!slug) throw new HTTPException(400, { message: 'Missing slug parameter' });

    const menu = await mensaService.getMensaMenuBySlug(slug);

    return c.json(successResponse(menu));
  },

  async syncMenus(c: Context) {
    await scanService.scanAllAndSync();
    return c.json(successResponse);
  }
};
