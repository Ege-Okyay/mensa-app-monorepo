import { getConfig } from '../src/core/config';

const VARS_FILE = '.dev.vars';

async function validate() {
  const file = Bun.file(VARS_FILE);

  if (!(await file.exists())) {
    console.error(`${VARS_FILE} not found`);
    process.exit(1);
  }

  const text = await file.text();
  const env: Record<string, string> = {};

  text.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');

    if (key && rest.length) {
      env[key.trim()] = rest.join('=').replace(/^["']["']$/g, '');
    }
  });

  try {
    console.log(`>>> Validating ${VARS_FILE}...`);

    getConfig({
      ...env,
      MENSA_APP_CACHE: {},
      GENERAL_RATE_LIMITER: {},
      PUSH_RATE_LIMITER: {}
    } as any);

    console.log('Config is valid');

    return env;
  } catch (error: any) {
    console.error('Config error:');
    console.error(error.message);

    process.exit(1);
  }
}

validate();
