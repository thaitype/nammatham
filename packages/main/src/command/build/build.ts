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
    target: 'node18',
    sourcemap: 'inline',
    format: isESM ? 'esm' : 'cjs',
    ...options.buildOption?.esbuildOptions,
  } as BuildOptions);
  debug?.(`Code bundled completed`);
  return outfile;
}
