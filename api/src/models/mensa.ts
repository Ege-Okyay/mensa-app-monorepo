import { z } from 'zod';
import type { Database, Json } from './database.types.js';

export type Mensa = Database['public']['Tables']['mensas']['Row'];
export type MensaCurrentMenu = Database['public']['Tables']['mensa_current_menus']['Row'];

export interface MensaWithMenu extends Mensa {
  current_menu: Pick<MensaCurrentMenu, 'menu_data' | 'updated_at'> | null;
}

export const CreateMenuSchema = z.object({
  mensa_id: z.uuid(),
  menu_data: z.record(z.string(), z.any())
});
