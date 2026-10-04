import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(projectRoot, '.env');
const environmentPath = resolve(projectRoot, 'src/environments/environment.ts');

const env = Object.fromEntries(
  (await readFile(envPath, 'utf8'))
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const separator = line.indexOf('=');
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    })
);

const licenseKey = env.PRIMEUI_LISCENCE_KEY ?? env.PRIMEUI_LICENSE_KEY;

if (!licenseKey) {
  throw new Error('Missing PRIMEUI_LISCENCE_KEY in .env');
}

await mkdir(dirname(environmentPath), { recursive: true });
await writeFile(
  environmentPath,
  `export const environment = {\n  primeUiLicenseKey: ${JSON.stringify(licenseKey)}\n} as const;\n`
);
