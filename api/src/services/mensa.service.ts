import { HTTPException } from 'hono/http-exception';
import { CreateMenuSchema, MenuDataSchema, type Mensa, type MensaCurrentMenu, type MensaWithMenu, type MenuData } from '../models/mensa';
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../models/database.types";

/**
 * Helper function to transform and validate database results
 */
const mapMensaWithMenu = (row: any): MensaWithMenu => ({
  ...row,
  current_menu: row.current_menu ? {
    ...row.current_menu,
    menu_data: MenuDataSchema.parse(row.current_menu.menu_data)
  } : null
});

/**
 * Business logic for handling mensas and their current menus.
 */
export const mensaService = {
  /**
   * Fetches all mensas without menu data.
   */
  async getAllMensas(supabase: SupabaseClient<Database>, kv: KVNamespace): Promise<Mensa[]> {
    const cached = await kv.get('mensas', 'json') as Mensa[];
    if (cached) {
      console.log('RETRIVED DATA FROM CACHE');
      return cached;
    }

    const { data, error } = await supabase
      .from('mensas')
      .select('*');

    if (error) throw new HTTPException(500, { message: error.message });

    await kv.put('mensas', JSON.stringify(data), { expirationTtl: 86400 });

    return data;
  },

  /**
   * Fetches all mensas along with their current menu data.
   */
  async getAllMensasWithMenu(supabase: SupabaseClient<Database>, kv: KVNamespace): Promise<MensaWithMenu[]> {
    const cached = await kv.get('mensas_with_menu', 'json') as MensaWithMenu[];
    if (cached) {
      console.log('RETRIVED DATA FROM CACHE');
      return cached;
    }

    const { data, error } = await supabase
      .from('mensas')
      .select(`
        id,
        slug,
        name,
        current_menu:mensa_current_menus (
          menu_data,
          updated_at
        )
      `);

    if (error) throw new HTTPException(500, { message: error.message });

    await kv.put('mensas_with_menu', JSON.stringify(data), { expirationTtl: 86400 });

    return (data || []).map(mapMensaWithMenu);
  },

  /**
   * Creates or updates a mensa menu after validating the input with Zod.
   * @param rawDto The unvalidated data from the scraper.
   */
  async createMensaMenu(supabase: SupabaseClient<Database>, rawDto: unknown, kv: KVNamespace): Promise<MensaCurrentMenu> {
    const result = CreateMenuSchema.safeParse(rawDto);

    if (!result.success) {
      throw new HTTPException(400, {
        message: `Invalid menu data: ${result.error.message}`
      });
    }

    const { data, error } = await supabase
      .from('mensa_current_menus')
      .upsert(result.data)
      .select()
      .single();

    if (error) throw new HTTPException(500, { message: error.message });

    const { data: mensa } = await supabase
      .from('mensas')
      .select('slug')
      .eq('id', result.data.mensa_id)
      .single();

    if (mensa) {
      await kv.delete(`menu:${mensa.slug}`);
      await kv.delete('mensas_with_menu');
    }

    return data;
  },

  /**
   * Fetches a specific mensa's menu using its URL slug.
   * @param slug Slug of the mensa.
   */
  async getMensaMenuBySlug(supabase: SupabaseClient<Database>, slug: string, kv: KVNamespace): Promise<MenuData> {
    const cached = await kv.get(`menu:${slug}`, 'json') as MenuData;
    if (cached) {
      console.log('RETRIVED DATA FROM CACHE');
      return cached;
    }

    const { data, error } = await supabase
      .from('mensas')
      .select(`
        current_menu:mensa_current_menus (
          menu_data
        )
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new HTTPException(500, { message: error.message });

    if (!data?.current_menu) {
      throw new HTTPException(404, { message: `Menu for slug '${slug}' not found` });
    }

    const menu = MenuDataSchema.parse(data.current_menu.menu_data);

    await kv.put(`menu:${slug}`, JSON.stringify(menu), { expirationTtl: 86400 });

    return menu;
  }
};
