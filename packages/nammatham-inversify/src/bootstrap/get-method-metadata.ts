import { ControllerParameterMetadata } from '../interfaces';
import { BootstrapControllerMethod } from './interfaces';
import * as utils from './utils';

function getParamsMethod(methodName: string, paramsMetadata: ControllerParameterMetadata) {
  if (paramsMetadata.hasOwnProperty(methodName)) return paramsMetadata[methodName];
  return [];
}

export function getMethodMetadata(controllers: NewableFunction[]) {
  const controllerMethods: BootstrapControllerMethod[] = [];

  for (const controller of controllers) {
    console.log(controller, controller, controller.name);
    const methodMetadata = utils.getControllerMethodMetadata(controller);
    const parameterMetadata = utils.getControllerParameterMetadata(controller);

    methodMetadata.forEach(method => {
      const methodName = method.key;
      controllerMethods.push({
        method,
        params: getParamsMethod(methodName, parameterMetadata),
      });
    });
  }
  return controllerMethods;
}
