/**
 *
 */
import { join } from 'node:path';
import { accessSync, readFileSync } from 'node:fs';
import { access, readFile } from 'node:fs/promises';

/**
 *
 *
 */
export function accessiblePathSync(path: string) {
  try {
    accessSync(path);
    return true;
  } catch (e) {
    return false;
  }
}

export async function accessiblePath(path: string) {
  try {
    await access(path);
    return true;
  } catch(e) {
    return false;
  }
}

export async function loadJson(path?: string) {
  const filePath = path ?? join(process.cwd(), 'configuration.json');
  const fileExist = await accessiblePath(filePath);
  if (!fileExist)
    throw new Error('Cannot fin configuration file at ' + filePath);

  return readFile(filePath, { encoding: 'utf8' });
}
export function loadJsonSync(path?: string) {
  const filePath = path ?? join(process.cwd(), 'configuration.json');
  const fileExist = accessiblePathSync(filePath);
  if (!fileExist)
    throw new Error('Cannot find configuration file at ' + filePath);

  return readFileSync(filePath, { encoding: 'utf8' });
}

/**
 *
 *
 */
export function generateObject(content: string) {
  let final!: object;

  try {
    final = JSON.parse(content);
  } catch(e) {
    console.error('Cannot parse the configuration. Please check the file syntax.', e);
    process.exit(1);
  }

  const entries = Object.entries(final);
  let typeStr = 'export interface JsonConfiguration {\n';

  for (const entry of entries) {
    const id = entry[0];
    const content = entry[1];
    const type = typeof content;
    let isArray: boolean | null = null;
    if (type === 'object') {
      isArray = content instanceof Array;
    }

    typeStr += `\t${ id }: ${ isArray ? 'Array<any>' : type };\n`;
  }

  typeStr += '}';
  const finalStr = `
    declare module global {
      namespace NodeJS {
        ${typeStr}
      }
    }
    
    export default {};
  `;

  return {
    final,
    finalStr
  };
}
