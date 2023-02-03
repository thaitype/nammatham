import { Container } from 'inversify';
import { TYPE } from '../contants';
import { AzureFunction } from '@azure/functions';
import { BaseController } from '../base-controller';
import { getAzureFunctionMethodMetadata } from './decorator-utils';
import { isUseHelper } from '../bindings';
type AzureFunctionParams = Parameters<AzureFunction>;

export interface IFuncBootstrapOption {
  container?: Container;
  classTarget: NewableFunction;
  methodName: string;
  azureFunctionParams: AzureFunctionParams;
}

function findBindingMethod(classTarget: NewableFunction, methodName: string) {
  const azureFunctionsMethodMetadata = getAzureFunctionMethodMetadata(classTarget);
  const found = azureFunctionsMethodMetadata.filter(method => method.key === methodName);
  if(found.length > 0) {
    return found[0].binding;
  }
  throw new Error(`Cannot find ${methodName} in ${classTarget.name}`);
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

  const useHelper = isUseHelper(findBindingMethod(option.classTarget, option.methodName));

  const controllerInstance = container.getNamed<BaseController>(TYPE.Controller, option.classTarget.name);
  // Set context to in
  controllerInstance.init(azureFunctionContext);
  if(useHelper){
    /** Use Helper Mode **/
    (controllerInstance as any)[option.methodName](...azureFunctionArgs);
  } else {
    /** Use Manual Mode **/
    (controllerInstance as any)[option.methodName](azureFunctionContext.bindings, ...azureFunctionArgs);
  }
}
