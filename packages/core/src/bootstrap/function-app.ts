import { Container } from 'inversify';
import fsPromise from 'node:fs/promises';
import fs from 'node:fs';
import slash from 'slash';
import path from 'node:path';
import _ from 'lodash';
import { attachControllers, resolveAllAzureFunctions } from './attach-controllers';
import { AzureFunctionJsonConfig } from '../bindings';
import { azFunctionTemplate } from './templates';
import { ControllerLocator } from './controller-locator';
import { IFuncBootstrapOption, funcBootstrap } from './function-bootstrap';
import { extractRelativeWorkingDirectory, removeExtension } from './utils';
import { ControllerMetadata } from '../interfaces';

const nammathamCacheDir = '.nammatham';

export interface IFunctionAppOption {
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
  /**
   * Register Controller
   */
  controllers?: NewableFunction[];
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
  if(!gitignoreLines.includes(nammathamCacheDir)){
    gitignoreLines.push(nammathamCacheDir);
  }
  await fsPromise.writeFile(gitignorePath, gitignoreLines.join('\n'), 'utf8');
}

export class FunctionApp {
  constructor(protected option: IFunctionAppOption) {}

  public run(funcBootstrapOption: IFuncBootstrapOption) {
    const { container } = this.option;
    // Reuse container and passing into `funcBootstrap`
    if (!container) {
      throw new Error(`Something went wrong, the container should be set when FunctionApp object is created`);
    }
    return funcBootstrap({
      container,
      ...funcBootstrapOption,
    });
  }

  public bindControllersWithContainer(container: Container) {
    attachControllers(container, this.option.controllers || []);
  }

  /**
   * Previously, bootstrap function.
   * Only 'Build' mode will execute this method.
   */
  public async build() {
    // const option = this.option;
    this.option.cwd = this.option.cwd ?? process.cwd();
  
    this.option.output = this.option.output ?? '';
    this.option.outDir = this.option.outDir ?? 'dist';
    this.option.extension = this.option.extension ?? 'js';
    this.option.gitignore = this.option.gitignore ?? true;
    this.option.clean = this.option.clean ?? true;

    const azureFunctionsMethodMetadata: ControllerMetadata[] = resolveAllAzureFunctions(this.option.controllers || []);

    const runtimeWorkingDirectory = extractRelativeWorkingDirectory(this.option.cwd, this.option.bootstrapPath);
    const startupPath = slash(
      path.join('..', runtimeWorkingDirectory, removeExtension(path.basename(this.option.bootstrapPath)))
    );
    const bootstrapCode = await fsPromise.readFile(this.option.bootstrapPath, 'utf8');
    const controllerLocator = new ControllerLocator(bootstrapCode);

    for (const metadata of azureFunctionsMethodMetadata) {
      const controllerName = (metadata.target as { name: string }).name;
      const controllerImportPath = controllerLocator.getControllerImportPath(controllerName);
      const controllerRelativePath = slash(path.join('..', runtimeWorkingDirectory, controllerImportPath));
      const functionName = metadata.name;

      const functionPath = path.join(this.option.output, functionName);
      // TODO: Make concurrent later
      if (this.option.clean) {
        fs.rmSync(functionPath, { recursive: true, force: true });
      }
      await fsPromise.mkdir(functionPath, { recursive: true });
      await fsPromise.mkdir(nammathamCacheDir, { recursive: true });
      const functionBinding: AzureFunctionJsonConfig = {
        bindings: metadata.binding,
        scriptFile: slash(path.join('..', this.option.outDir, functionPath, `index.${this.option.extension}`)),
      };
      await fsPromise.writeFile(
        path.join(functionPath, 'function.json'),
        JSON.stringify(functionBinding, null, 2),
        'utf8'
      );

      const azFunctionEndpointCode: string = azFunctionTemplate({
        controllerName,
        controllerRelativePath,
        functionName: _.camelCase(functionName),
        startupPath,
      });

      await fsPromise.writeFile(path.join(functionPath, 'index.ts'), azFunctionEndpointCode, 'utf8');

      if (this.option.gitignore) await appendGitignore(this.option.cwd, functionName);
    }
  }
}
