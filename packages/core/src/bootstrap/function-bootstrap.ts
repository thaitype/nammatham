import { Container } from 'inversify';
import { TYPE } from '../contants';
import { AzureFunction } from '@azure/functions';
import { BaseFunction } from '../base-function';
type AzureFunctionParams = Parameters<AzureFunction>;

export interface IFuncBootstrapOption {
  container?: Container;
  classTarget: NewableFunction;
  azureFunctionParams: AzureFunctionParams;
}

export function funcBootstrap(option: IFuncBootstrapOption) {
  const container = option.container ?? new Container();
  const [azureFunctionContext, ...azureFunctionArgs] = option.azureFunctionParams;

  const controllerInstance = container.getNamed<BaseFunction<any>>(TYPE.Controller, option.classTarget.name);
  // Set context to in
  controllerInstance.init(azureFunctionContext as any);
  // TODO: Move Check to check on build processs
  // if(!(controllerInstance.hasOwnProperty('execute'))){
  //   console.error( `No execute method overrided in the BaseFunction`)
  //   azureFunctionContext.res = {
  //     status: 500,
  //     body: `No execute method overrided in the BaseFunction`
  //   }
  //   return;
  // }
  // Fix method when execute the function
  return controllerInstance.execute(...azureFunctionArgs);
}
