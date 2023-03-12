import { getMethodMetadata } from './get-method-metadata';
import { registerAzureFunctions } from './register-azure-functions';

export interface IBootstrapOption {
  /**
   * Register Controller
   */
  controllers: NewableFunction[];
  instanceResolver:  (controller: NewableFunction) => unknown;

  bindControllers?: () => unknown;
}

export async function baseBootstrap(option: IBootstrapOption) {
  if(option.bindControllers)
    option.bindControllers();
  registerAzureFunctions(getMethodMetadata(option.controllers), option.instanceResolver);
}
