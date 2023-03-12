import { getMethodMetadata } from './get-method-metadata';
import { registerAzureFunctions } from './register-azure-functions';

export interface IBootstrapOption {
  /**
   * Register Controller
   */
  controllers: NewableFunction[];
  instanceResolver?: (controller: NewableFunction) => unknown;

  bindControllers?: () => unknown;
}

type Newable<T> = new (...args: any[]) => T;
function controllerFactory<T>(constructor: NewableFunction): T {
  return new (constructor as Newable<T>)();
}

export async function bootstrap(option: IBootstrapOption) {
  if (option.bindControllers) option.bindControllers();
  const defaultInstanceResolver = (controller: NewableFunction) => controllerFactory(controller);
  const instanceResolver = option.instanceResolver ?? defaultInstanceResolver;
  registerAzureFunctions(getMethodMetadata(option.controllers), instanceResolver);
}
