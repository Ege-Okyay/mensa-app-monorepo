import { $ } from 'bun';

const FILE_NAME = '.dev.vars';
const file = Bun.file(FILE_NAME);

if (!(await file.exists())) {
  console.error(`file ${FILE_NAME} not found`);
  process.exit(1);
}

const text = await file.text();
const lines = text.split('\n');

console.log(`>>> Syncing secrets from ${FILE_NAME}...`);

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  
  const [key, ...valueParts] = trimmed.split('=');
  const value = valueParts.join('=').replace(/^["']|["']$/g, '');

  if (key && value) {
    console.log(`Setting: ${key}`);

    try {
      await $`echo ${value} | bunx wrangler secret put ${key}`;
    } catch (err) {
      console.error(`error setting ${key}: ${err}`);
    }
  }
}
