import type { Container } from './interfaces';
import { core } from '@nammatham/core';

export function attachControllers(container: Container, controllers: core.Constructor[]) {
  for (const controller of controllers) {
    container.register(controller, { useClass: controller });
  }
}
