import { Constructor } from '../interfaces';
import { getMethodMetadata } from './get-method-metadata';
import { registerAzureFunctions } from './register-azure-functions';
import { ObjectLike } from './types';

export interface IBootstrapOption {
  /**
   * Register Controller
   */
  controllers: Constructor[];
  instanceResolver?: (controller: Constructor) => ObjectLike;

  bindControllers?: () => unknown;
}

function controllerFactory<T>(constructor: Constructor): T {
  return new (constructor as Constructor<T>)();
}

export function bootstrap(option: IBootstrapOption) {
  if (option.bindControllers) option.bindControllers();
  const defaultInstanceResolver = (controller: Constructor): ObjectLike => controllerFactory(controller);
  const instanceResolver = option.instanceResolver ?? defaultInstanceResolver;
  registerAzureFunctions(getMethodMetadata(option.controllers), instanceResolver);
}
