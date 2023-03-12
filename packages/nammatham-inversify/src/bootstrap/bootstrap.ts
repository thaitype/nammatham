import { Container } from 'inversify';
import { attachControllers } from './attach-controllers';
import { getMethodMetadata } from './get-method-metadata';
import { registerAzureFunctions } from './register-azure-functions';

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
  registerAzureFunctions(getMethodMetadata(option.controllers));
}
