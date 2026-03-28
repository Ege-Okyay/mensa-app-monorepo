import { HTTPException } from 'hono/http-exception';
import { config } from '../core/config.js';
import { mensaService } from './mensa.service.js';
import type { MenuData } from '../models/mensa.js';

export const scanService = {
  /**
   * Triggers the scraper, processes all returned menus, and updates the database.
   */
  async scanAllAndSync(): Promise<void> {
    try {
      const response = await fetch(`${config.scraperUrl}/test`);
      if (!response.ok) {
        throw new Error(`Scraper returned ${response.status}: ${await response.text()}`);
      }

      const rawResults = await response.json() as MenuData[];

      const mensas = await mensaService.getAllMensas();

      for (const result of rawResults) {
        const matchedMensa = mensas.find(m =>
          m.name.toLowerCase() === result.mensa_name.toLowerCase()
        );

        if (!matchedMensa) {
          console.warn(`Scraper found menu for '${result.mensa_name}', but no matching Mensa in DB.`);
          continue;
        }

        await mensaService.createMensaMenu({
          mensa_id: matchedMensa.id,
          menu_data: result
        });
      }
    } catch (err) {
      console.error('Scan and sync failed:', err);
      throw new HTTPException(500, { message: 'Failed to sync with scraper' });
    }
  }
};
