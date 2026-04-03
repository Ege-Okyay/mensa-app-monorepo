import { createClient } from '@supabase/supabase-js';
import { getConfig, type Env } from './config.js';
import type { Database } from '../models/database.types.js';

export const getSupabase = (env: Env) => {
  const config = getConfig(env);

  return createClient<Database>(
    config.supabase.url,
    config.supabase.key
  );
};
