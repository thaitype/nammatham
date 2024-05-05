import type { BuildOptions } from 'esbuild';

import path from 'node:path';
import { build } from 'esbuild';

import type { NammathamConfigs } from '../nammatham-config';

import { createDebugger } from '../utils';
import { findNearestPackageData } from '../packages';

const debug = createDebugger('nammatham:build');

export interface BundleCodeOptions {
  entryFile?: string;
  esbuildOptions?: BuildOptions;
}


/**
 * When publish into Azure Functions, the package.json will not be included in the final package.
 * So, it needs to specify the output file manually wheather it is ESM or CommonJS. for example `main.mjs` or `main.cjs`
 * 
 * I don't sure which version of node.js installed in Azure Functions, so I will use `es2020` as the target.
 * Using target `es2021` will use `||=` operator which is not supported in Node.js.
 * 
 * Azure Functions node runtime on Custom Handler is using Node.js 16.x 
 * 
 * The hono-node-server support the target node.js version 18.x and above
 * 
 * 
 */

export async function bundleCode(options: NammathamConfigs): Promise<string> {
  const workingDir = process.cwd();
  const pkg = findNearestPackageData(workingDir);
  const isESM = pkg?.data.type === 'module';
  debug?.(`Running in Module Type: ${isESM ? 'ESM' : 'CommonJS'}`);

  const entryFile = options.buildOption?.entryFile ?? pkg?.data.main ?? 'main.ts';
  debug?.(`Bundling code from ${entryFile}`);

  const distDirectory = path.resolve(workingDir, options.buildPath ?? '.nmt', 'dist');
  const outfile = path.resolve(distDirectory, 'main.js');
  debug?.(`Bundling code to ${outfile}`);

  await build({
    absWorkingDir: workingDir,
    entryPoints: [entryFile],
    bundle: true,
    outfile,
    platform: 'node',
    target: 'es2020',
    sourcemap: 'inline',
    format: 'cjs',
    ...options.buildOption?.esbuildOptions,
  } as BuildOptions);
  debug?.(`Code bundled completed`);
  return outfile;
}
