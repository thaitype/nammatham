import { Container } from 'inversify';

import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import slash from 'slash';
import path from 'node:path';
import { attachControllers, resolveAllAzureFunctions } from './attach-controllers';
import { AzureFunctionJsonConfig } from '../bindings';
import { azFunctionTemplate } from './templates';
import { ControllerLocator } from './controller-locator';
import { IFuncBootstrapOption, funcBootstrap } from './function-bootstrap';
import { ControllerMetadata } from '../interfaces';

/**
 * Scoped service locators
 */
export interface IFunctionModule {
  /**
   * Register Controller
   */
  controllers?: NewableFunction[];
  /**
   * Register Providers
   */
  providers?: NewableFunction[];
  /**
   * Register custom service by inversify
   */
  register?: (container: Container) => void;
}

export interface IFunctionAppOption extends IFunctionModule {
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
   * Automatic add gitignore for function endpoint, default = true
   */
  gitignore?: boolean;
  /**
   * Clean generated files before build, default = true
   */
  clean?: boolean;
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

async function appendGitignore(cwd: string, functionName: string) {
  const gitignorePath = path.join(cwd, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    await fsPromise.writeFile(gitignorePath, functionName, 'utf8');
    return;
  }
  // Assume the gitignore file is a small file, more secure: https://geshan.com.np/blog/2021/10/nodejs-read-file-line-by-line/
  const gitignoreLines = (await fsPromise.readFile(gitignorePath, 'utf8')).split(/\r?\n/);
  if (!gitignoreLines.includes(functionName)) {
    gitignoreLines.push(functionName);
  }
  await fsPromise.writeFile(gitignorePath, gitignoreLines.join('\n'), 'utf8');
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

function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf('.'));
}

export class FunctionApp {
  constructor(protected option: IFunctionAppOption) {}

  public run(funcBootstrapOption: IFuncBootstrapOption) {
    const { container } = this.option;
    /**
     *  TODO: app.run('getName', [context, ...args]);
     */
    // Reuse container and passing into `funcBootstrap`
    if (!container) {
      throw new Error(`Something went wrong, the container should be set when FunctionApp object is created`);
    }
    return funcBootstrap({
      container,
      ...funcBootstrapOption,
    });
  }

  public bindModuleWithContainer(container: Container) {
    attachControllers(container, this.option.controllers || []);
  }

  /**
   * Previously, bootstrap function.
   * Only 'Build' mode will execute this method.
   */
  public async build() {
    const option = this.option;
    const container = option.container ?? new Container();
    const cwd = option.cwd ?? process.cwd();
    const output = option.output ?? '';
    const outDir = option.outDir ?? 'dist';
    const extension = option.extension ?? 'js';
    const enableGitignore = option.gitignore ?? true;
    const enableClean = option.clean ?? true;

    const azureFunctionsMethodMetadata: ControllerMetadata[] = resolveAllAzureFunctions(container, this.option.controllers || []);

    const runtimeWorkingDirectory = extractRuntimeWorkingDirectory(cwd, option.bootstrapPath);
    const startupPath = slash(
      path.join('..', runtimeWorkingDirectory, removeExtension(path.basename(option.bootstrapPath)))
    );
    const bootstrapCode = await fsPromise.readFile(option.bootstrapPath, 'utf8');
    const controllerLocator = new ControllerLocator(bootstrapCode);

    for (const metadata of azureFunctionsMethodMetadata) {
      const controllerName = (metadata.target as { name: string }).name;
      const controllerImportPath = controllerLocator.getControllerImportPath(controllerName);
      const controllerRelativePath = slash(path.join('..', runtimeWorkingDirectory, controllerImportPath));
      // const methodName = metadata.key;
      const functionName = metadata.name;

      const functionPath = path.join(output, functionName);
      // TODO: Make concurrent later
      if (enableClean) {
        fs.rmSync(functionPath, { recursive: true, force: true });
      }
      await fsPromise.mkdir(functionPath, { recursive: true });
      const functionBinding: AzureFunctionJsonConfig = {
        bindings: metadata.binding,
        scriptFile: slash(path.join('..', outDir, functionPath, `index.${extension}`)),
      };
      await fsPromise.writeFile(
        path.join(functionPath, 'function.json'),
        JSON.stringify(functionBinding, null, 2),
        'utf8'
      );

      const azFunctionEndpointCode: string = azFunctionTemplate({
        controllerName,
        controllerRelativePath,
        // methodName,
        functionName,
        startupPath,
      });

      await fsPromise.writeFile(path.join(functionPath, 'index.ts'), azFunctionEndpointCode, 'utf8');

      if (enableGitignore) await appendGitignore(cwd, functionName);
    }
  }
}
