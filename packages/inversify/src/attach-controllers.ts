import { Container } from 'inversify';
import { core } from '@nammatham/core';

export function attachControllers(container: Container, controllers: core.Constructor[]) {
  for (const controller of controllers) {
    container
      .bind(core.TYPE.Controller)
      .to(controller)
      .whenTargetNamed(controller.name);
  }
}