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

    const methodMetadataList: BootstrapControllerMethod['methodMetadataList'] = [];
    methodMetadata.forEach(method => {
      const methodName = method.key;

      methodMetadataList.push({
        method,
        params: getParamsMethod(methodName, parameterMetadata),
      });
    });

    controllerMethods.push({
      controller,
      methodMetadataList,
    });
  }
  return controllerMethods;
}
