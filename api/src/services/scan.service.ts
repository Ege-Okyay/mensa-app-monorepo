import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../models/database.types';
import type { MenuData } from '../models/mensa';
import { mensaService } from './mensa.service';

export const scanService = {
  async applySync(
    supabase: SupabaseClient<Database>,
    rawResults: MenuData[],
    kv: KVNamespace
  ): Promise<void> {
    // Update / merge menus
    const mensas = await mensaService.getAllMensas(supabase, kv);

    for (const result of rawResults) {
      console.log(result);
      const matchedMensa = mensas.find(m => m.name.toLocaleLowerCase() === result.mensa_name.toLocaleLowerCase());

      if (!matchedMensa) {
        console.warn(`No DB match for: ${result.mensa_name}`);
        continue;
      }

      await mensaService.createMensaMenu(supabase, {
        mensa_id: matchedMensa.id,
        menu_data: result
      }, kv);
    }

    await kv.delete('mensas');
  }
};
