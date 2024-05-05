import type { BuildOptions as EsbuildOptions } from 'esbuild';

import path from 'node:path';
import { system } from 'pkg-fetch';
import { exec as pkgExec } from 'pkg';
import { build as esbuild } from 'esbuild';

import type { NammathamConfigs } from '../nammatham-config';

import { createDebugger } from '../utils';
import { findNearestPackageData } from '../packages';

const debug = createDebugger('nammatham:build');

export interface TargetOptions {
  /**
   * The target platform for the build.
   */
  platform: 'linux' | 'win' | 'macos';
  /**
   * The target architecture for the build.
   */
  arch: 'x64' | 'arm64';
  /**
   * The target node.js or bun version.
   *
   * For node.js, only support version 18 due to minimum version of Nammatham Framework.
   */
  runtime: 'bun' | 'node18';
}

export interface BuildOptions {
  /**
   * The entry file for the build. If not specified, it will use the main file from the package.json.
   */
  entryFile?: string;
  /**
   * Specify the target for the build.
   *
   * If not specified, it will build for the host platform.
   * Accept the following values:
   * - `host`: Build for the host platform.
   * - An object that specifies the target platform, architecture, and runtime.
   *
   * @default 'host'
   */
  target?: 'host' | TargetOptions;
  /**
   * esbuild options
   */
  esbuildOptions?: EsbuildOptions;
}

export async function build(options: NammathamConfigs): Promise<void> {
  if (options.runtime === 'node') {
    const result = await buildNodeJs(options);
    await buildExecutable(options, result);
  } else {
    throw new Error(`Unsupported runtime: ${options.runtime}`);
  }
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
export interface BuildNodeJsResult {
  filePath: string;
  distDirectory: string;
}

export async function buildNodeJs(options: NammathamConfigs): Promise<BuildNodeJsResult> {
  const workingDir = process.cwd();
  const pkg = findNearestPackageData(workingDir);
  const isESM = pkg?.data.type === 'module';
  debug?.(`Running in Module Type: ${isESM ? 'ESM' : 'CommonJS'}`);

  const entryFile = options.buildOption?.entryFile ?? pkg?.data.main ?? 'main.ts';
  debug?.(`Bundling code from ${entryFile}`);

  const distDirectory = path.resolve(workingDir, options.buildPath ?? '.nmt', 'dist');
  const outfile = path.resolve(distDirectory, 'main.js');
  debug?.(`Bundling code to ${outfile}`);

  await esbuild({
    absWorkingDir: workingDir,
    entryPoints: [entryFile],
    bundle: true,
    outfile,
    platform: 'node',
    target: 'es2020',
    sourcemap: 'inline',
    /**
     * Due to limitation of `pkg` package, the output file must be CommonJS
     */
    format: 'cjs',
    ...options.buildOption?.esbuildOptions,
  } as EsbuildOptions);
  debug?.(`Code bundled completed`);
  return { filePath: outfile, distDirectory };
}

/**
 * @ref github.com/vercel/pkg/lib/index.ts
 */
export function getHostTarget(): TargetOptions {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const nodeVersion = process.version.match(/^v(\d+)/)![1];
  debug?.(`Host Node.js Version: ${nodeVersion}`);

  return {
    platform: system.hostPlatform as TargetOptions['platform'],
    arch: system.hostArch as TargetOptions['arch'],
    /**
     * The pkg version 5.8.1 only support node.js version 18.x and below.
     */
    runtime: 'node18',
  };
}

/**
 * Build the executable file for Azure Functions, need to be bundled first
 *
 * This function use `pkg` internally to build the executable file. the `pkg` package is marked as deprecated.
 * However, the `pkg` package is still the best option to build the executable file for Azure Functions.
 * You can read the official statement from the `pkg` package [here](https://github.com/vercel/pkg)
 *
 * Another official option is using [Single executable applications](https://nodejs.org/api/single-executable-applications.html) since node.js 21.x
 * But it's too complicated to use, and the `pkg` is still the best option.
 * @ref See how to build the with node.js https://dev.to/chad_r_stewart/compile-a-single-executable-from-your-node-app-with-nodejs-20-and-esbuild-210j
 */
export async function buildExecutable(options: NammathamConfigs, result: BuildNodeJsResult): Promise<void> {
  const target = options.buildOption?.target ?? 'host';
  let targetOptions: TargetOptions;
  if (target === 'host') {
    targetOptions = getHostTarget();
  } else {
    targetOptions = target;
  }
  const targetString = `${targetOptions.runtime}-${targetOptions.platform}-${targetOptions.arch}`;
  const pkgArgs = [result.filePath, '--target', targetString, '--output', path.join(result.distDirectory, 'main')];
  debug?.(`Building executable using pkg with args: ${pkgArgs.join(' ')}`);
  await pkgExec(pkgArgs);
  debug?.(`Executable built completed`);
}
