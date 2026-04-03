import { HTTPException } from 'hono/http-exception';
import { mensaService } from './mensa.service.js';
import type { MenuData } from '../models/mensa.js';
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../models/database.types.js";

export const scanService = {
  /**
   * Triggers the scraper, processes all returned menus, and updates the database.
   */
  async scanAllAndSync(
    supabase: SupabaseClient<Database>,
    scraperConfig: { url: string; key: string }
  ): Promise<void> {
    try {
      const response = await fetch(`${scraperConfig.url}/test`, {
        headers: {
          'X-Internal-Key': scraperConfig.key
        }
      });

      if (!response.ok) {
        throw new Error(`Scraper returned ${response.status}: ${await response.text()}`);
      }

      const rawResults = await response.json() as MenuData[];

      const mensas = await mensaService.getAllMensas(supabase);

      for (const result of rawResults) {
        const matchedMensa = mensas.find(m =>
          m.name.toLowerCase() === result.mensa_name.toLowerCase()
        );

        if (!matchedMensa) {
          console.warn(`Scraper found menu for '${result.mensa_name}', but no matching Mensa in DB.`);
          continue;
        }

        await mensaService.createMensaMenu(supabase, {
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
