import { $ } from 'execa';
import path from 'node:path';

import type { NammathamConfigs } from '../nammatham-config';
import type { TargetBunOptions, TargetOptions } from './types';

import { debug } from './internal';
import { getDistDirectory, getExecutablePath, getPackageInfo } from './build';
/**
 * Call bun as a sub-process to build the executable file, for preventing the bundle with tsup
 */

export async function buildExecutableBun(config: NammathamConfigs) {
  debug?.(`Building for Bun runtime`);

  const target = getHostTargetBun(config.buildOptions?.target);
  const runtime = config.runtime;

  debug?.(`Building executable for target: ${runtime}-${target.platform}-${target.arch}`);

  const targetString = `${runtime}-${target.platform}-${target.arch}`;

  debug?.(`Building executable using bun with args: ${targetString}`);
  const bunVersion = await getBunVersion();
  debug?.(`Using Bun version: ${JSON.stringify(bunVersion)}`);

  const { entryFile } = getPackageInfo(config);

  // bun build --compile --target=bun-linux-x64 ./index.ts --outfile myapp
  const executablePath = getExecutablePath(target);
  const distDirectory = getDistDirectory(config);
  const outFile = path.join(distDirectory, executablePath);
  const buildOutput = await $`bun build --compile --target=${targetString} ${entryFile} --outfile ${outFile}`;
  debug?.(`Bun build output`);
  debug?.(buildOutput.stdout);
  debug?.(`Bun build completed`);
}

export async function getBunVersion() {
  try {
    const { stdout } = await $`bun -v`;
    const version = stdout.trim();
    return version;
  } catch (error) {
    console.error('Error getting bun version or bun is not installed.');
    process.exit(1);
  }
}

/**
 * Convert to bun cli format
 * note: if no .exe extension is provided, Bun will automatically add it for Windows executables
 * Ref: https://bun.sh/docs/bundler/executables
 */
export function getHostTargetBun(baseTarget?: TargetOptions): TargetBunOptions {
  if (!baseTarget) {
    throw new Error(`Target should be set at the default configuration when the cli loaded`);
  }
  let platform: TargetBunOptions['platform'] = baseTarget.platform as TargetBunOptions['platform'];
  if (baseTarget.platform === 'win') {
    platform = 'windows';
  } else if (baseTarget.platform === 'macos') {
    platform = 'darwin';
  }

  return {
    // runtime: baseTarget.runtime,
    platform,
    arch: baseTarget.arch,
  };
}
