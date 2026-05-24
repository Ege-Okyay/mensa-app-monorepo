import { z } from 'zod';

const envSchema = z.object({
  // Internal
  PORT: z.string().optional().default('8787'),
  SCRAPER_KEY: z.string().min(1, 'SCRAPER_KEY is required'),

  // Supabase
  SUPABASE_URL: z.string().min(1, 'SUPABASE_URL is required'),
  SUPABASE_KEY: z.string().min(1, 'SUPABASE_KEY is required'),

  // Push Notifications
  VAPID_PUBLIC_KEY: z.string().min(1, 'VAPID_PUBLIC_KEY is required'),
  VAPID_PRIVATE_KEY: z.string().min(1, 'VAPID_PRIVATE_KEY is required'),
  VAPID_SUBJECT: z.string().min(1, 'VAPID_SUBJECT is required'),

  // Cloudflare bindings
  MENSA_APP_CACHE: z.any(),
  GENERAL_RATE_LIMITER: z.any(),
  PUSH_RATE_LIMITER: z.any()
});

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
    scraperKey: data.SCRAPER_KEY,
    supabase: {
      url: data.SUPABASE_URL,
      key: data.SUPABASE_KEY
    },
    vapid: {
      publicKey: data.VAPID_PUBLIC_KEY,
      privateKey: data.VAPID_PRIVATE_KEY,
      subject: data.VAPID_SUBJECT
    }
  }
};
