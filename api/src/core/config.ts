export type Env = {
  PORT: string;
  INTERNAL_API_KEY: string;
  
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  
  SCRAPER_URL: string;
  SCRAPER_KEY: string;
  
  MENSA_APP_CACHE: KVNamespace;
  MENSA_APP_RATE_LIMITER: RateLimit;
};

export const getConfig = (env: Env) => {
  return {
    port: env.PORT,
    internalApiKey: env.INTERNAL_API_KEY,
    supabase: {
      url: env.SUPABASE_URL,
      key: env.SUPABASE_KEY 
    },
    scraper: {
      url: env.SCRAPER_URL,
      key: env.SCRAPER_KEY
    }
  }
};
