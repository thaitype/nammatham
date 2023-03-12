import { Container } from 'inversify';
import { core } from '@nammatham/core';

export function attachControllers(container: Container, controllers: NewableFunction[]) {
  for (const controller of controllers) {
    const controllerMetadata = core.getControllerMetadata(controller);
    const constructor = controllerMetadata.target;

    container
      .bind(core.TYPE.Controller)
      .to(constructor as new (...args: Array<never>) => unknown)
      .whenTargetNamed(controller.name);
  }

}