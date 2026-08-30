import { HTTPException } from 'hono/http-exception';
import { CreateMenuSchema, MenuDataSchema, ScheduleSchema, type Mensa, type MensaCurrentMenu, type Schedule } from '../models/mensa';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../models/database.types';

/**
 * Helper function to transform and validate database results
 */
const mapMensaWithMenu = (row: any): Mensa => ({
  ...row,
  schedule: parseSchedule(row.schedule),
  current_menu: row.current_menu ? {
    ...row.current_menu,
    menu_data: MenuDataSchema.parse(row.current_menu.menu_data)
  } : null
});

/**
 * Helper function to safely parse mensa schedules from JSON
 */
const parseSchedule = (json: unknown): Schedule | null => {
  if (!json || typeof json !== 'object') return null;

  const result = ScheduleSchema.safeParse(json);

  return result.success ? result.data : null;
}

/**
 * Business logic for handling mensas and their current menus
 */
export const mensaService = {
  /**
   * Fetches all mensas without their current menu data
   */
  async getAllMensas(supabase: SupabaseClient<Database>, kv: KVNamespace): Promise<Mensa[]> {
    const cached = await kv.get('mensas', 'json') as Mensa[];
    if (cached) return cached;

    const { data, error } = await supabase
      .from('mensas')
      .select(`
        id, slug, name, location, schedule,
        current_menu:mensa_current_menus ( mensa_id )
      `);

    if (error) throw new HTTPException(500, { message: error.message });

    // Probably can write this in a more cleaner way
    // But it works so no need to touch it for now
    const result = (data || []).map(m => ({
      ...m,
      has_menu: m.current_menu !== null,
      current_menu: undefined,
      schedule: parseSchedule(m.schedule),
    }));

    await kv.put('mensas', JSON.stringify(result), { expirationTtl: 86400 });

    return result;
  },

  /**
   * Fetches a single mensa with its current menu data using its slug
   * @param slug Slug of the mensa.
   */
  async getMensaWithMenuBySlug(supabase: SupabaseClient<Database>, slug: string, kv: KVNamespace): Promise<Mensa> {
    const cached = await kv.get(`mensa:${slug}`, 'json') as Mensa;
    if (cached) return cached;

    const { data, error } = await supabase
      .from('mensas')
      .select(`
        id, slug, name, location, schedule,
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
   * Creates or updates a mensa menu after validating the input with Zod
   * @param rawDto The unvalidated data from the scraper
   */
  async createMensaMenu(supabase: SupabaseClient<Database>, rawDto: unknown, kv: KVNamespace): Promise<MensaCurrentMenu> {
    const result = CreateMenuSchema.safeParse(rawDto);

    if (!result.success) throw new HTTPException(400, { message: `Invalid menu data: ${result.error.message}` });

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
  },

  /**
   * Clears the whole `mensa_current_menus` table from database
   * Deletes `mensas` key and `mensa:mensa_name` keys from cache
   */
  async clearMensaMenus(supabase: SupabaseClient<Database>, kv: KVNamespace) {
    const { data: mensas, error: fetchError } = await supabase
      .from('mensas')
      .select('id, slug');

    if (fetchError) throw new HTTPException(500, { message: fetchError.message });
    if (!mensas || mensas.length === 0) return;

    const ids = mensas.map(m => m.id);
    const slugs = mensas.map(m => m.slug);

    const { error: deleteError } = await supabase
      .from('mensa_current_menus')
      .delete()
      .in('mensa_id', ids);

    if (deleteError) throw new HTTPException(500, { message: deleteError.message });

    await kv.delete('mensas');
    await Promise.all(
      slugs.map(slug => kv.delete(`mensa:${slug}`))
    );
  }
};
