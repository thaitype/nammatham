import type { BuildOptions } from 'esbuild';

import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

import type { NammathamCommandOptions } from '../cli';

import { DEFAULT_CONFIG_FILES } from './constants';
import { createDebugger, isFilePathESM } from './utils';

const debug = createDebugger('nammatham:config');

export interface NammathamConfigs extends NammathamCommandOptions {
  some?: string;
}

const promisifiedRealpath = promisify(fs.realpath);

/**
 * Type helper to make it easier to use nammatham.config.ts
 * accepts a direct {@link NammathamConfigs} object
 */
export function defineConfig(config: NammathamConfigs) {
  return config;
}

export async function simpleLoadConfig(fileName: string): Promise<NammathamConfigs> {
  const fileBase = `${fileName}.timestamp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const fileNameTmp = `${fileBase}.mjs`;

  await build({
    entryPoints: [fileName],
    bundle: true,
    outfile: fileNameTmp,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    sourcemap: false,
  } as BuildOptions);

  try {
    const option = (await import(fileNameTmp)).default;
    return option;
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fs.unlink(fileNameTmp, () => {}); // ignore the error
  }
}

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
    const bundled = await bundleConfigFile(resolvedPath, isESM);
    debug?.(`Running in Module Type: ${isESM ? 'ESM' : 'CommonJS'}`);
    const userConfig = await loadConfigFromBundledFile(resolvedPath, bundled.code, isESM);
    debug?.(`bundled config file loaded in ${getTime()}`);
    return userConfig;
  } catch (e) {
    console.error(`Failed to load config file in ${getTime()}`);
    throw e;
  }
}

/***
 * From Vite
 */
export async function bundleConfigFile(
  fileName: string,
  isESM: boolean
): Promise<{
  code: string;
  dependencies: string[];
}> {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [fileName],
    bundle: true,
    write: false,
    platform: 'node',
    target: 'node18',
    sourcemap: 'inline',
    format: isESM ? 'esm' : 'cjs',
    metafile: true,
  } as BuildOptions);

  const { text } = result.outputFiles ? result.outputFiles[0] : { text: '' };
  return {
    code: text,
    dependencies: result.metafile ? Object.keys(result.metafile.inputs) : [],
  };
}

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}

/**
 * From Vite
 */
const _require = createRequire(import.meta.url);
async function loadConfigFromBundledFile(
  fileName: string,
  bundledCode: string,
  isESM: boolean
): Promise<NammathamConfigs> {
  // for esm, before we can register loaders without requiring users to run node
  // with --experimental-loader themselves, we have to do a hack here:
  // write it to disk, load it with native Node ESM, then delete the file.
  if (isESM) {
    const fileBase = `${fileName}.timestamp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const fileNameTmp = `${fileBase}.mjs`;
    const fileUrl = `${pathToFileURL(fileBase)}.mjs`;
    await fs.promises.writeFile(fileNameTmp, bundledCode);
    try {
      return (await import(fileUrl)).default;
    } finally {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fs.unlink(fileNameTmp, () => {}); // Ignore errors
    }
  }
  // for cjs, we can register a custom loader via `_require.extensions`
  else {
    const extension = path.extname(fileName);
    // We don't use fs.promises.realpath() here because it has the same behaviour as
    // fs.realpath.native. On some Windows systems, it returns uppercase volume
    // letters (e.g. "C:\") while the Node.js loader uses lowercase volume letters.
    // See https://github.com/vitejs/vite/issues/12923
    const realFileName = await promisifiedRealpath(fileName);
    const loaderExt = extension in _require.extensions ? extension : '.js';
    const defaultLoader = _require.extensions[loaderExt]!;
    _require.extensions[loaderExt] = (module: NodeModule, filename: string) => {
      if (filename === realFileName) {
        (module as NodeModuleWithCompile)._compile(bundledCode, filename);
      } else {
        defaultLoader(module, filename);
      }
    };
    // clear cache in case of server restart
    delete _require.cache[_require.resolve(fileName)];
    const raw = _require(fileName);
    _require.extensions[loaderExt] = defaultLoader;
    return raw.__esModule ? raw.default : raw;
  }
}
