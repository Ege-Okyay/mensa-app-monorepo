import { z } from 'zod';

const envSchema = z.object({
  // Env variables
  PORT: z.string().optional().default('8787'),
  SCRAPER_KEY: z.string().min(1, 'SCRAPER_KEY is required'),
  SUPABASE_URL: z.string().min(1, 'SUPABASE_URL is required'),
  SUPABASE_KEY: z.string().min(1, 'SUPABASE_KEY is required'),

  // Cloudflare bindings
  MENSA_APP_CACHE: z.any(),
  MENSA_APP_RATE_LIMITER: z.any()
})

export type Env = z.infer<typeof envSchema>;

export const getConfig = (env: Env) => {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errorMsg = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid Env Config:\n${errorMsg}`);
  }

  const data = result.data;

  return {
    port: data.PORT,
    supabase: {
      url: data.SUPABASE_URL,
      key: data.SUPABASE_KEY
    },
    scraperKey: data.SCRAPER_KEY
  }
};
