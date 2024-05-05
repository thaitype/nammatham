import type { BuildOptions } from 'esbuild';

import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';

import type { NammathamConfigs } from './nammatham-config';

import { isFilePathESM } from './utils';
import { createDebugger } from '../utils';
import { DEFAULT_CONFIG_FILES } from './constants';
import { provideDefaultConfig } from './default-config';

const debug = createDebugger('nammatham:config');

/**
 * Ref: packages/vite/src/node/config.ts
 * @param file
 */

export async function loadConfigFromFile(file?: string, configRoot = process.cwd()) {
  let resolvedPath: string | undefined;
  const start = performance.now();
  const getTime = () => `${(performance.now() - start).toFixed(2)}ms`;

  if (file) {
    resolvedPath = path.resolve(file);
  } else {
    for (const filename of DEFAULT_CONFIG_FILES) {
      const filePath = path.resolve(configRoot, filename);
      if (!fs.existsSync(filePath)) continue;

      resolvedPath = filePath;
      break;
    }
  }

  if (!resolvedPath) {
    debug?.('Cannot find config file in %s', configRoot);
    return null;
  }

  const isESM = isFilePathESM(resolvedPath);

  try {
    const bundledCode = await buildConfigFile(resolvedPath);
    debug?.(`Running in Module Type: ${isESM ? 'ESM' : 'CommonJS'}`);
    const userConfig = await loadConfigFromBuiltFile(resolvedPath, bundledCode);
    debug?.(`bundled config file loaded in ${getTime()}`);
    return provideDefaultConfig(userConfig);
  } catch (e) {
    console.error(`Failed to load config file in ${getTime()}`);
    throw e;
  }
}

/***
 * Build the config file, always convert to ESM
 */
export async function buildConfigFile(fileName: string): Promise<string> {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    bundle: false,
    write: false,
    platform: 'node',
    target: 'node18',
    sourcemap: 'inline',
    format: 'esm',
  } as BuildOptions);

  const { text } = result.outputFiles ? result.outputFiles[0] : { text: '' };
  return text;
}

/**
 * Somehow, using `.mjs` extension is always work both in ESM and CommonJS on the target project module type
 */

async function loadConfigFromBuiltFile(fileName: string, code: string): Promise<NammathamConfigs> {
  const fileBase = `${fileName}.timestamp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const fileNameTmp = `${fileBase}.mjs`;
  const fileUrl = `${pathToFileURL(fileBase)}.mjs`;
  await fs.promises.writeFile(fileNameTmp, code);
  try {
    return (await import(fileUrl)).default;
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fs.unlink(fileNameTmp, () => {}); // Ignore errors
  }
}
