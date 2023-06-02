/**
 *
 */
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { generateObject, loadJson, loadJsonSync } from './utils';

/**
 * Load configuration file synchronously;
 *
 * @param returnObj { boolean = false }
 * @param path { string? }
 */
export function configJsonSync(returnObj = false, path?: string) {
  const configurationFileContent = loadJsonSync(path);
  const finalContent = generateObject(configurationFileContent);

  try {
    writeFileSync(join(process.cwd(), 'configuration.ts'), finalContent.finalStr);

  } catch(e) {
    console.error('Cannot generate json configuration types in TS.', e);
    process.exit(1);
  }
}

/**
 * Load configuration file using asynchronously.
 *
 * @param returnObj { boolean = false }
 * @param path { string? }
 */
export async function configJson(returnObj = false, path?: string) {
  const configurationFileContent = await loadJson(path);
  const finalContent = generateObject(configurationFileContent);

  try {
    await writeFile(join(process.cwd(), 'configuration.ts'), finalContent.finalStr);

  } catch(e) {
    console.error('Cannot generate json configuration types in TS.', e);
    process.exit(1);
  }
}
