import { z } from 'zod';
import type { Database } from './database.types.js';

export type Mensa = Database['public']['Tables']['mensas']['Row'];
export type MensaCurrentMenu = Database['public']['Tables']['mensa_current_menus']['Row'];

export const LocalizedDishSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const MenuItemSchema = z.object({
  it: LocalizedDishSchema,
  en: LocalizedDishSchema,
  tr: LocalizedDishSchema,
  allergens: z.array(z.string()),
});

export const MenuDataSchema = z.object({
  mensa_name: z.string(),
  first_courses: z.array(MenuItemSchema),
  main_courses: z.array(MenuItemSchema),
  side_dishes: z.array(MenuItemSchema),
  specialties_available: z.boolean(),
  common_allergens: z.array(z.string())
});

export type LocalizedDish = z.infer<typeof LocalizedDishSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuData = z.infer<typeof MenuDataSchema>;

export interface MensaWithMenu extends Mensa {
  current_menu: {
    menu_data: MenuData;
    updated_at: string | null;
  } | null;
}

export const CreateMenuSchema = z.object({
  mensa_id: z.uuid(),
  menu_data: MenuDataSchema
});
