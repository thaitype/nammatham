import { Container } from 'inversify';
import { ControllerMethodMetadata } from '../interfaces';
import path from 'node:path';
import { attachControllers } from './attach-controllers';

interface IBootstrapOption {
  /**
   * Allow self define container
   */
  container?: Container;
  /**
   * Register Controller, this value is not use to inject DI
   * TODO: Using register controller to bind the dependencies
   */
  controllers: NewableFunction[];
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
  const controllerMethodMetadata = attachControllers(container, option.controllers);

  for (const metadata of controllerMethodMetadata) {
    const controllerName = (metadata.method.target.constructor as { name: string }).name;
    const methodName = metadata.method.key;
    const functionName = metadata.method.name;
    const params = metadata.params;

    const log = { controllerName, methodName, functionName, params}
    console.log(log)
  }
}
