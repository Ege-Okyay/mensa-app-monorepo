import { HTTPException } from 'hono/http-exception';
import { CreateMenuSchema, MenuDataSchema, type Mensa, type MensaCurrentMenu } from '../models/mensa';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../models/database.types';

/**
 * Helper function to transform and validate database results
 */
const mapMensaWithMenu = (row: any): Mensa => ({
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
   * Fetches all mensas without their current menu data.
   */
  async getAllMensas(supabase: SupabaseClient<Database>, kv: KVNamespace): Promise<Mensa[]> {
    const cached = await kv.get('mensas', 'json') as Mensa[];
    if (cached) return cached;

    const { data, error } = await supabase
      .from('mensas')
      .select(`
        id, slug, name, location,
        current_menu:mensa_current_menus ( mensa_id )
      `);

    if (error) throw new HTTPException(500, { message: error.message });

    const result = (data || []).map(m => ({
      ...m,
      has_menu: m.current_menu !== null,
      current_menu: undefined
    }));

    await kv.put('mensas', JSON.stringify(result), { expirationTtl: 86400 });

    return result;
  },

  /**
   * Fetches a single mensa with its current menu data using its slug.
   * @param slug Slug of the mensa.
   */
  async getMensaWithMenuBySlug(supabase: SupabaseClient<Database>, slug: string, kv: KVNamespace): Promise<Mensa> {
    const cached = await kv.get(`mensa:${slug}`, 'json') as Mensa;
    if (cached) return cached;

    const { data, error } = await supabase
      .from('mensas')
      .select(`
        id, slug, name, location,
        current_menu:mensa_current_menus ( menu_data )
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw new HTTPException(500, { message: error.message });
    if (!data) throw new HTTPException(404, { message: `Mensa '${slug}' not found` });

    const mensa = mapMensaWithMenu(data);

    await kv.put(`mensa:${slug}`, JSON.stringify(mensa), { expirationTtl: 86400 });

    return mensa;
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
      .upsert({
        mensa_id: result.data.mensa_id,
        menu_data: result.data.menu_data as any
      })
      .select()
      .single();

    if (error) throw new HTTPException(500, { message: error.message });

    const { data: mensa } = await supabase
      .from('mensas')
      .select('slug')
      .eq('id', result.data.mensa_id)
      .single();

    if (mensa) {
      await kv.delete(`mensa:${mensa.slug}`);
      await kv.delete('mensas');
    }

    return data;
  }
};
