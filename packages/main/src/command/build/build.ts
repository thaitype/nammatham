import fs from 'node:fs';
import path from 'node:path';
import { system } from 'pkg-fetch';

import type { NammathamConfigs } from '../nammatham-config';
import type { TargetBunOptions, TargetOptions } from './types';

import { createDebugger } from '../utils';
import { buildExecutableBun } from './bun';
import { constructHostConfig } from '../config';
import { findNearestPackageData } from '../packages';
import { buildExecutableNodeJs, buildNodeJs } from './nodejs';

export const debug = createDebugger('nammatham:build');

/**
 * Hard code the function.json for the SimpleHttpTrigger
 */
export function hardCodeFunctionJson() {
  return {
    bindings: [
      {
        type: 'httpTrigger',
        direction: 'in',
        name: 'req',
        methods: ['get', 'post'],
      },
      {
        type: 'http',
        direction: 'out',
        name: 'res',
      },
    ],
  };
}

export async function build(config: NammathamConfigs): Promise<void> {
  const targetPath = path.resolve(config.buildPath ?? '.nmt', 'dist');
  fs.mkdirSync(targetPath, { recursive: true });
  await fs.promises.writeFile(path.join(targetPath, 'host.json'), constructHostConfig(config), 'utf-8');
  if (config.runtime === 'node') {
    debug?.(`Building for Node.js runtime`);
    const result = await buildNodeJs(config);
    await buildExecutableNodeJs(config, result);
    debug?.(`Build for Node.js completed`);
  } else if (config.runtime === 'bun') {
    debug?.(`Building for Bun runtime`);
    await buildExecutableBun(config);
  } else {
    throw new Error(`Unsupported runtime: ${config.runtime}`);
  }
  // Hard code, fix later
  const functionPath = path.join(targetPath, 'SimpleHttpTrigger');
  fs.mkdirSync(functionPath, { recursive: true });
  await fs.promises.writeFile(
    path.join(functionPath, 'function.json'),
    JSON.stringify(hardCodeFunctionJson(), null, 2),
    'utf-8'
  );
}

/**
 * @ref github.com/vercel/pkg/lib/index.ts
 */
export function getHostTarget(): TargetOptions {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nodeVersion = process.version.match(/^v(\d+)/)![1];
  debug?.(`Host Node.js Version: ${nodeVersion}`);

  return {
    platform: process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'macos' : 'linux',
    arch: system.hostArch as TargetOptions['arch'],
    // /**
    //  * The pkg version 5.8.1 only support node.js version 18.x and below.
    //  */
    // runtime: 'node18',
  };
}

export function getPackageInfo(config: NammathamConfigs): {
  entryFile: string;
  isESM: boolean;
} {
  const workingDir = process.cwd();
  const pkg = findNearestPackageData(workingDir);
  const isESM = pkg?.data.type === 'module';
  debug?.(`Running in Module Type: ${isESM ? 'ESM' : 'CommonJS'}`);

  return {
    entryFile: config.buildOption?.entryFile ?? pkg?.data.main ?? 'main.ts',
    isESM,
  };
}

export function getExecutablePath(target: TargetOptions | TargetBunOptions): string {
  return target.platform === 'win' || target.platform === 'windows' ? 'main.exe' : 'main';
}

export function getDistDirectory(options: NammathamConfigs): string {
  return path.resolve(process.cwd(), options.buildPath ?? '.nmt', 'dist');
}
