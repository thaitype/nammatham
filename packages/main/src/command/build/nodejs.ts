import type { BuildOptions as EsbuildOptions } from 'esbuild';

import path from 'node:path';
import { exec as pkgExec } from 'pkg';
import { build as esbuild } from 'esbuild';

import type { NammathamConfigs } from '../nammatham-config';

import { debug, getDistDirectory, getExecutablePath, getPackageInfo } from './build';

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
  if (options.buildOptions?.nodeToolChain?.bundle !== 'esbuild') {
    throw new Error(`Unsupported bundler: ${options.buildOptions?.nodeToolChain?.bundle}`);
  }
  const workingDir = process.cwd();
  const { entryFile } = getPackageInfo(options);
  debug?.(`Bundling code from ${entryFile}`);

  const distDirectory = getDistDirectory(options);
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
    ...options.buildOptions?.esbuildOptions,
  } as EsbuildOptions);
  debug?.(`Code bundled completed`);
  return { filePath: outfile, distDirectory };
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
export async function buildExecutableNodeJs(options: NammathamConfigs, result: BuildNodeJsResult): Promise<void> {
  if (options.buildOptions?.nodeToolChain?.package !== 'pkg') {
    throw new Error(`Unsupported package tool: ${options.buildOptions?.nodeToolChain?.package}`);
  }
  const target = options.buildOptions?.target;
  const runtime = options.runtime;
  if (!target) {
    throw new Error(`Target should be set at the default configuration when the cli loaded`);
  }
  debug?.(`Building executable for target: ${runtime}-${target.platform}-${target.arch}`);
  const targetString = `${runtime}-${target.platform}-${target.arch}`;
  const executablePath = getExecutablePath(target);
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
