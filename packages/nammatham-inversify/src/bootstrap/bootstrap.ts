import { Container } from 'inversify';
import { attachControllers } from './attach-controllers';
import { getMethodMetadata } from './get-method-metadata';

interface IBootstrapOption {
  /**
   * Allow self define container
   */
  container?: Container;
  /**
   * Register Controller
   */
  controllers: NewableFunction[];
}

export async function bootstrap(option: IBootstrapOption) {
  const container = option.container ?? new Container();
  attachControllers(container, option.controllers);
  const controllerMethodMetadata = getMethodMetadata(option.controllers);

  for (const metadata of controllerMethodMetadata) {
    const controllerName = (metadata.method.target.constructor as { name: string }).name;
    const methodName = metadata.method.key;
    const functionName = metadata.method.name;
    const params = metadata.params;

    const log = { controllerName, methodName, functionName}
    console.log(log, JSON.stringify(params, null, 2))
  }
}
