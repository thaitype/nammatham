import { Container } from 'inversify';
import { AzureFunctionMethodMetadata } from '../interfaces';

import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import slash from 'slash';
import path from 'node:path';
import { attachControllers } from './attach-controllers';
import { AzureFunctionJsonConfig } from '../bindings';

interface IBootstrapOption {
  /**
   * Allow self define container
   */
  container?: Container;
  /**
   * Current working directory, default is current directory
   */
  cwd?: string;
  /**
   * Output generated TypeScript files and function config
   */
  output?: string;
  /**
   * Bootstrap file location by passing `__filename` into it
   * Use for generate TypeScript files
   */
  bootstrapPath: string;
  /**
   * Register Controller, this value is not use to inject DI
   * TODO: Using register controller to bind the dependencies
   */
  controllers: NewableFunction[];
  /**
   * Dist directory path, the output directory of JS files, default = dist
   */
  outDir?: string;
  /**
   * JavaScript Extenstion used for `scriptFile` in Azure Function Config,
   * Default = js
   */
  extension?: string;
  /**
   * TODO: Incremental build file
   */
}

/**
 *
 * Example:
 *  - cwd = '/home/nammatham/examples/crud'
 *  - absolutePath = '/home/nammatham/examples/crud/src/main.ts'
 *
 * Return:
 *  - 'src/'
 *
 * @param cwd Working Directory
 * @param absolutePath Absolute Path file
 * @returns
 */

function extractRuntimeWorkingDirectory(cwd: string, absolutePath: string) {
  return path.dirname(absolutePath).replace(cwd, '');
}

export async function bootstrap(option: IBootstrapOption) {
  const container = option.container ?? new Container();
  const cwd = option.cwd ?? process.cwd();
  const output = option.output ?? '';
  const outDir = option.outDir ?? 'dist';
  const extension = option.extension ?? 'js';
  const azureFunctionsMethodMetadata: AzureFunctionMethodMetadata[] = attachControllers(container, option.controllers);

  for (const metadata of azureFunctionsMethodMetadata) {
    const controllerName = (metadata.target.constructor as { name: string }).name;
    const methodName = metadata.key;
    const functionName = metadata.name;

  }
}
