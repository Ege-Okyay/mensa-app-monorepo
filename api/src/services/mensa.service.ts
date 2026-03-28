import { HTTPException } from 'hono/http-exception';
import { supabase } from '../core/supabase.js';
import { CreateMenuSchema, MenuDataSchema, type Mensa, type MensaCurrentMenu, type MensaWithMenu, type MenuData } from '../models/mensa.js';

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
  async getAllMensas(): Promise<Mensa[]> {
    const { data, error } = await supabase
      .from('mensas')
      .select('*');

    if (error) throw new HTTPException(500, { message: error.message });

    return data;
  },

  /**
   * Fetches all mensas along with their current menu data.
   */
  async getAllMensasWithMenu(): Promise<MensaWithMenu[]> {
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

    return (data || []).map(mapMensaWithMenu);
  },

  /**
   * Creates or updates a mensa menu after validating the input with Zod.
   * @param rawDto The unvalidated data from the scraper.
   */
  async createMensaMenu(rawDto: unknown): Promise<MensaCurrentMenu> {
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

    return data;
  },

  /**
   * Fetches a specific mensa's menu using its URL slug.
   * @param slug Slug of the mensa.
   */
  async getMensaMenuBySlug(slug: string): Promise<MenuData> {
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

    if (!data || !data.current_menu) {
      throw new HTTPException(404, { message: `Menu for slug '${slug}' not found` });
    }

    return MenuDataSchema.parse(data.current_menu.menu_data);
  }
}
