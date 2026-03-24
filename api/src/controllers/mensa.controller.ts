import type { Context } from 'hono';
import { mensaService } from '../services/mensa.service.js';
import { successResponse } from '../core/response.js';
import { HTTPException } from 'hono/http-exception';

/**
 * Handlers for mensas and their current menu data.
 */
export const mensaController = {
  /**
   * Returns a list of all mensa locations.
   */
  async getAllMensas(c: Context) {
    const mensas = await mensaService.getAllMensas();

    return c.json(successResponse(mensas));
  },

  /**
   * Returns all mensas including their menus for today.
   */
  async getAllMensasWithMenu(c: Context) {
    const mensas = await mensaService.getAllMensasWithMenu();

    return c.json(successResponse(mensas));
  },

  /**
   * Fetches the current menu for a specific mensa using its URL slug.
   */
  async getMenuBySlug(c: Context) {
    const slug = c.req.param('slug');
    if (!slug) throw new HTTPException(400, { message: `Missing "slug" parameter` });

    const menu = await mensaService.getMensaMenuBySlug(slug);

    return c.json(successResponse(menu));
  }
};
