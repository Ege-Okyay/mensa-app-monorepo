import 'dotenv/config';

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];

  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }

  return value || (defaultValue as string);
};

export const config = {
  port: parseInt(getEnv('PORT', '3000'), 10),
  supabase: {
    url: getEnv('SUPABASE_URL'),
    key: getEnv('SUPABASE_KEY'),
  },
};
