import { Container } from 'inversify';
import {
  getControllerMethodMetadata,
  getControllerMetadata,
  getControllersFromContainer,
  getControllerParameterMetadata,
} from './utils';
import { TYPE } from '../contants';
import { ControllerMethodMetadata, ControllerParameterMetadata, ParameterMetadata } from '../interfaces';

export interface BootstrapControllerMethod {
  method: ControllerMethodMetadata;
  params: ParameterMetadata[];
}

const config = {
  forceControllers: true, // throw if no controller assigned
};

function getParamsMethod(methodName: string, paramsMetadata: ControllerParameterMetadata) {
  if (paramsMetadata.hasOwnProperty(methodName)) return paramsMetadata[methodName];
  return [];
}

export function attachControllers(container: Container, controllers: NewableFunction[]) {
  for (const controller of controllers) {
    const controllerMetadata = getControllerMetadata(controller);
    const constructor = controllerMetadata.target;

    container
      .bind(TYPE.Controller)
      .to(constructor as new (...args: Array<never>) => unknown)
      .whenTargetNamed(controller.name);
  }

  const _controllers = getControllersFromContainer(container, config.forceControllers);

  const controllerMethods: BootstrapControllerMethod[] = [];

  for (const controller of _controllers) {
    console.log(controller, controller.constructor, controller.name);

    const methodMetadata = getControllerMethodMetadata(controller.constructor);
    const parameterMetadata = getControllerParameterMetadata(controller.constructor);

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