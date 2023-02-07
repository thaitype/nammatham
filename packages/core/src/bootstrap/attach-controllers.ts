import { Container } from 'inversify';
import { getControllerMetadata } from './utils';
import { TYPE } from '../contants';
import { ControllerMetadata } from '../interfaces';

export function attachControllers(container: Container, controllers: NewableFunction[]) {
  for (const controller of controllers) {
    const controllerMetadata = getControllerMetadata(controller);
    if (!controllerMetadata) {
      console.warn('controllerMetadata is undefined');
      continue;
    }
    const constructor = controllerMetadata.target;

    container
      .bind(TYPE.Controller)
      .to(constructor as new (...args: Array<never>) => unknown)
      .whenTargetNamed(controller.name);
  }
}

export function resolveAllAzureFunctions(controllers: NewableFunction[]) {
  const azureFunctions: ControllerMetadata[] = [];
  for (const controller of controllers) {
    const controllerMetadata = getControllerMetadata(controller);
    azureFunctions.push(controllerMetadata);
  }

  return azureFunctions;
}
