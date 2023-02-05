import { Container } from 'inversify';
import { TYPE } from '../contants';
import { attachControllers } from './attach-controllers';
import { AzureFunction, Context } from '@azure/functions';
import { BaseFunction } from '../base-controller';
import { getAzureFunctionMethodMetadata } from './utils';
type AzureFunctionParams = Parameters<AzureFunction>;

export interface IFuncBootstrapOption {
  container?: Container;
  classTarget: NewableFunction;
  azureFunctionParams: AzureFunctionParams;
}

export function funcBootstrap(option: IFuncBootstrapOption) {
  const container = option.container ?? new Container();
  const [azureFunctionContext, ...azureFunctionArgs] = option.azureFunctionParams;

  // Unbind the Fake Context in attachControllers
  // container.unbind(TYPE.Context);
  // // Binding Azure Function Context
  // container
  //   .bind<Context>(TYPE.Context)
  //   .toConstantValue(azureFunctionContext)

  const controllerInstance = container.getNamed<BaseFunction<any>>(TYPE.Controller, option.classTarget.name);
  // Set context to in
  controllerInstance.init(azureFunctionContext);
  // Fix method when execute the function
  (controllerInstance as any)['execute'](azureFunctionContext, ...azureFunctionArgs);
}
