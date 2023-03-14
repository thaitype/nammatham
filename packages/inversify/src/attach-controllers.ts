import { Container } from 'inversify';
import { core } from '@nammatham/core';

export function attachControllers(container: Container, controllers: NewableFunction[]) {
  for (const controller of controllers) {
    container
      .bind(core.TYPE.Controller)
      .to(controller as new (...args: Array<never>) => unknown)
      .whenTargetNamed(controller.name);
  }
}