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
    const now = new Date();
    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();

    // Afternoon clear
    if (hour >= 15) {
      console.log('Mensa closed -> Clearing all current menus...');
      
      await supabase.from('mensa_current_menus').delete().not('mensa_id', 'is', null);
      await kv.delete('mensas');

      return;
    }

    // Morning reset (8:15 - 8:35)
    if (hour === 8 && minute >= 15 && minute <= 35) {
      console.log('Daily reset -> clearing previous data...');

      await supabase.from('mensa_current_menus').delete().not('mensa_id', 'is', null);
      await kv.delete('mensas');
    }

    // Update / merge menus
    const mensas = await mensaService.getAllMensas(supabase, kv);

    for (const result of rawResults) {
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
