import fs from 'node:fs';
import path from 'node:path';
import { system } from 'pkg-fetch';

import type { NammathamConfigs } from '../nammatham-config';
import type { TargetBunOptions, TargetOptions } from './types';

import { createDebugger } from '../utils';
import { buildExecutableBun } from './bun';
import { findNearestPackageData } from '../packages';
import { buildExecutableNodeJs, buildNodeJs } from './nodejs';
import { constructHostConfig, constructLocalSettings } from '../config';

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

/**
 * Build the runtime based on the configuration
 */
export async function buildRuntime(config: NammathamConfigs) {
  if (config.runtime === 'node') {
    debug?.(`Building for Node.js runtime`);
    debug?.(`Host Node.js Version: ${getHostTarget().version}`);
    const result = await buildNodeJs(config);
    await buildExecutableNodeJs(config, result);
    debug?.(`Build for Node.js completed`);
  } else if (config.runtime === 'bun') {
    debug?.(`Building for Bun runtime`);
    await buildExecutableBun(config);
  } else {
    throw new Error(`Unsupported runtime: ${config.runtime}`);
  }
}

export async function build(config: NammathamConfigs): Promise<void> {
  const targetPath = path.resolve(config.buildPath ?? '.nmt', 'dist');
  fs.mkdirSync(targetPath, { recursive: true });
  await fs.promises.writeFile(path.join(targetPath, 'host.json'), constructHostConfig(config), 'utf-8');
  await fs.promises.writeFile(path.join(targetPath, 'local.settings.json'), constructLocalSettings(), 'utf-8');

  if (config.buildOptions?.disabled) {
    debug?.(`Build process disabled`);
    console.log(`The build process is disabled, you need to manage the build process manually.`);
    console.log(`Please build the code manually and create a single-executable file on the target path: ${targetPath}`);
    console.log(
      `The file should be: "${getExecutablePath(
        getHostTarget()
      )}" (Same value from host.json at customHandler.description.defaultExecutablePath)`
    );
    console.log(`The other Azure Functions configurations will be managed by the framework.`);
  } else {
    await buildRuntime(config);
  }
  // Hard code, fix later
  // TODO: Please remove all `function.json` files before generating the new one
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

  return {
    platform: process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'macos' : 'linux',
    arch: system.hostArch as TargetOptions['arch'],
    version: parseInt(nodeVersion),
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
    entryFile: config.buildOptions?.entryFile ?? pkg?.data.main ?? 'main.ts',
    isESM,
  };
}

export function getExecutablePath(
  target: NonNullable<NammathamConfigs['buildOptions']>['target'] | TargetBunOptions
): string {
  return target?.platform === 'win' || target?.platform === 'windows' ? 'main.exe' : 'main';
}

export function getDistDirectory(options: NammathamConfigs): string {
  return path.resolve(process.cwd(), options.buildPath ?? '.nmt', 'dist');
}
