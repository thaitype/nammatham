import type { BuildOptions as EsbuildOptions } from 'esbuild';

import fs from 'node:fs';
import path from 'node:path';
import { system } from 'pkg-fetch';
import { exec as pkgExec } from 'pkg';
import { build as esbuild } from 'esbuild';

import type { NammathamConfigs } from '../nammatham-config';

import { createDebugger } from '../utils';
import { constructHostConfig } from '../config';
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
   * @default undefined (build for the host platform)
   */
  target?: TargetOptions;
  /**
   * esbuild options, using for build and bundle the code, especially for Node.js runtime.
   */
  esbuildOptions?: EsbuildOptions;
  /**
   * Node.js toolchain options, using for build and package the code.
   *
   * @default { dev: 'tsx', bundle: 'esbuild', package: 'pkg' }
   */
  nodeToolChain?: {
    /**
     * The development tool to use for the Node.js runtime.
     * `tsx` support watch mode for TypeScript.
     */
    dev?: 'tsx';
    /**
     * The bundler tool to bundle the code, before package the code into a single executable file.
     */
    bundle?: 'esbuild';
    /**
     * The package tool to package the code into a single executable file.
     * `pkg` internally used for build the executable file. the `pkg` package is marked as deprecated.
     *
     * TODO: Support node.js [Single executable applications](https://nodejs.org/api/single-executable-applications.html) method
     *
     * @default 'pkg'
     */
    package?: 'pkg';
  };
}

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

export async function build(options: NammathamConfigs): Promise<void> {
  const targetPath = path.resolve(options.buildPath ?? '.nmt', 'dist');
  fs.mkdirSync(targetPath, { recursive: true });
  await fs.promises.writeFile(path.join(targetPath, 'host.json'), constructHostConfig(options), 'utf-8');
  if (options.runtime === 'node') {
    debug?.(`Building for Node.js runtime`);
    const result = await buildNodeJs(options);
    await buildExecutable(options, result);
    debug?.(`Build for Node.js completed`);
  } else if (options.runtime === 'bun') {
    debug?.(`Building for Bun runtime`);
    // Bun.write(path.resolve(targetPath, 'bun.txt'), `Hello Bun with Node.js`);
  } else {
    throw new Error(`Unsupported runtime: ${options.runtime}`);
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
  if (options.buildOption?.nodeToolChain?.bundle !== 'esbuild') {
    throw new Error(`Unsupported bundler: ${options.buildOption?.nodeToolChain?.bundle}`);
  }
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
    platform: process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'macos' : 'linux',
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
  if (options.buildOption?.nodeToolChain?.package !== 'pkg') {
    throw new Error(`Unsupported package tool: ${options.buildOption?.nodeToolChain?.package}`);
  }
  const target = options.buildOption?.target;
  if (!target) {
    throw new Error(`Target should be set at the default configuration when the cli loaded`);
  }
  debug?.(`Building executable for target: ${target.runtime}-${target.platform}-${target.arch}`);
  if (target.runtime === 'bun') {
    throw new Error(`Conflict target build runtime: ${target.runtime} with ${options.runtime}`);
  }
  const targetString = `${target.runtime}-${target.platform}-${target.arch}`;
  const executablePath = target.platform === 'win' ? 'main.exe' : 'main';
  const pkgArgs = [
    result.filePath,
    '--target',
    targetString,
    '--output',
    path.join(result.distDirectory, executablePath),
  ];
  debug?.(`Building executable using pkg with args: ${pkgArgs.join(' ')}`);
  await pkgExec(pkgArgs);
  debug?.(`Executable built completed`);
}
