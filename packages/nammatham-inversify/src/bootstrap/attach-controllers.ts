import { Container } from 'inversify';
import {
  getAzureFunctionMethodMetadata,
  getControllerMetadata,
  getControllersFromContainer,
} from './utils';
import { TYPE } from '../contants';
import { AzureFunctionMethodMetadata } from '../interfaces';


const config = {
  forceControllers: true, // throw if no controller assigned
};

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

  const azureFunctions: AzureFunctionMethodMetadata[] = [];

  for (const controller of _controllers) {
    console.log(controller, controller.constructor, controller.name);

    const methodMetadata = getAzureFunctionMethodMetadata(controller.constructor);
    methodMetadata.forEach((metadata: AzureFunctionMethodMetadata) => {
      azureFunctions.push({
        ...metadata,
      });
    });
  }
  return azureFunctions;
}