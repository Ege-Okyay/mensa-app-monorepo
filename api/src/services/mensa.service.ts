import { HTTPException } from 'hono/http-exception';
import { supabase } from '../core/supabase.js';
import { CreateMenuSchema, type Mensa, type MensaCurrentMenu, type MensaWithMenu } from '../models/mensa.js';

export class MensaService {
  async getAll(): Promise<Mensa[]> {
    const { data, error } = await supabase
      .from('mensas')
      .select('*');
    
    if (error) throw new HTTPException(500, { message: error.message });

    return data;
  }

  async getAllWithMenu(): Promise<MensaWithMenu[]> {
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

    return data;
  }

  async createMenu(rawDto: unknown): Promise<MensaCurrentMenu> {
    const result = CreateMenuSchema.safeParse(rawDto);

    if (!result.success) throw new HTTPException(400, { message: `Invalid menu data: ${result.error.message}` });

    const { data, error } = await supabase
      .from('mensa_current_menus')
      .upsert(result.data)
      .select()
      .single();

    if (error) throw new HTTPException(500, { message: error.message });

    return data;
  }

  async getCurrentMenuBySlug(slug: string): Promise<MensaCurrentMenu> {
    const { data, error } = await supabase
      .from('mensas')
      .select(`
        current_menu:mensa_current_menus (
          mensa_id,
          menu_data,
          updated_at
        )
      `)
      .eq('slug', slug)
      .maybeSingle();
    
    if (error) throw new HTTPException(500, { message: error.message });

    if (!data || !data.current_menu) {
      throw new HTTPException(404, { message: `Menu for slug "${slug}" not found` });
    }

    return data.current_menu;
  }
}
