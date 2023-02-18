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
import { GitignoreManager } from './gitignore-manager';

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

    const gitignoreManager = new GitignoreManager('Nammatham/AzureFunctions/GeneratedFiles' ,this.option.cwd);
    await gitignoreManager.readLines();
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

      gitignoreManager.appendContentLines(functionName);
    }
    if (this.option.gitignore){
      await gitignoreManager.writeLines();
    }
    
  }
}
