import { Container } from 'inversify';
import { AzureFunctionMethodMetadata } from '../interfaces';

import fs from 'node:fs/promises';
import slash from 'slash';
import path from 'node:path';
import { attachControllers } from './attach-controllers';
import { AzureFunctionJsonConfig } from '../bindings';
import { azFunctionTemplate } from './templates';
import { ControllerLocator } from './controller-locator';

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
}

export async function bootstrap(option: IBootstrapOption) {
  const container = option.container ?? new Container();
  const cwd = option.cwd ?? process.cwd();
  const output = option.output ?? '';
  const azureFunctionsMethodMetadata: AzureFunctionMethodMetadata[] = attachControllers(container);

  console.log('----');
  console.log(option.bootstrapPath);
  const bootstrapCode = await fs.readFile(option.bootstrapPath, 'utf8');
  const controllerLocator = new ControllerLocator(bootstrapCode);

  // 1. get list of functions name
  for (const metadata of azureFunctionsMethodMetadata) {
    const controllerName = (metadata.target.constructor as { name: string }).name;
    const controllerRelativePath = slash(path.join('..', controllerLocator.getControllerImportPath(controllerName)));
    console.log(controllerRelativePath)
    const methodName = metadata.key;
    const functionName = metadata.name;

    const functionPath = path.join(output, metadata.name);
    // TODO: Make concurrent later
    await fs.mkdir(functionPath, { recursive: true });
    const functionBinding: AzureFunctionJsonConfig = {
      bindings: metadata.binding,
    };
    await fs.writeFile(path.join(functionPath, 'function.json'), JSON.stringify(functionBinding, null, 2), 'utf8');

    const azFunctionEndpointCode: string = azFunctionTemplate({
      controllerName,
      controllerRelativePath,
      methodName,
      functionName,
    });

    await fs.writeFile(path.join(functionPath, 'index.ts'), azFunctionEndpointCode, 'utf8');
  }
  // 2. create out dir

  // TODO: generate files from container
  // TODO:
  /**
     *  └── out
          └── GetUsers
              ├── function.json
              └── index.ts
     */
}
