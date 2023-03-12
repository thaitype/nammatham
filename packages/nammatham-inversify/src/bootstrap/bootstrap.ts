import { Container } from 'inversify';
import { attachControllers } from './attach-controllers';
import { getMethodMetadata } from './get-method-metadata';
import { registerAzureFunctions } from './register-azure-functions';
import { TYPE } from '../contants';

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
  registerAzureFunctions(getMethodMetadata(option.controllers), (controller: NewableFunction) => {
    /**
     * Resolving instance using inversify
     */
    return container.getNamed(TYPE.Controller, controller.name);
  });
}
