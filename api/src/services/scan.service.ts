import { HTTPException } from 'hono/http-exception';
import { mensaService } from './mensa.service';
import type { MenuData } from '../models/mensa';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../models/database.types';

export const scanService = {
  /**
   * Triggers the scraper, processes all returned menus, and updates the database.
   */
  async scanAllAndSync(
    supabase: SupabaseClient<Database>,
    scraperConfig: { url: string; key: string },
    kv: KVNamespace
  ): Promise<void> {
    try {
      const response = await fetch(`${scraperConfig.url}/scrape`, {
        headers: {
          'X-Internal-Key': scraperConfig.key
        }
      });

      if (!response.ok) throw new Error(`Scraper returned ${response.status}: ${await response.text()}`);

      const rawResults = await response.json() as MenuData[];

      await this.applySync(supabase, rawResults, kv);
    } catch (err) {
      console.error('Scan and sync failed:', err);
      throw new HTTPException(500, { message: 'Failed to sync with scraper' });
    }
  },

  async applySync(
    supabase: SupabaseClient<Database>,
    rawResults: MenuData[],
    kv: KVNamespace
  ): Promise<void> {
    const mensas = await mensaService.getAllMensas(supabase, kv);
    const syncedMensaIds: string[] = [];

    for (const result of rawResults) {
      const matchedMensa = mensas.find(m => m.name.toLowerCase() === result.mensa_name.toLowerCase());

      if (!matchedMensa) {
        console.warn(`Scraper found menu for '${result.mensa_name}', but no matching Mensa in DB`);
        continue;
      }

      await mensaService.createMensaMenu(supabase, {
        mensa_id: matchedMensa.id,
        menu_data: result
      }, kv);

      syncedMensaIds.push(matchedMensa.id);
    }

    // Remove old menus
    const { data: currentMenuRecords } = await supabase
      .from('mensa_current_menus')
      .select('mensa_id');

    const staleMensaIds = (currentMenuRecords || [])
      .map(r => r.mensa_id)
      .filter(id => !syncedMensaIds.includes(id));

    if (staleMensaIds.length > 0) {
      await supabase
        .from('mensa_current_menus')
        .delete()
        .in('mensa_id', staleMensaIds);

      for (const id of staleMensaIds) {
        const mensa = mensas.find(m => m.id === id);
        if (mensa) await kv.delete(`mensa:${mensa.slug}`);
      }
    }

    await kv.delete('mensas');
  }
};
