import type { Container } from './interfaces';
import { core } from '@nammatham/core';

export function attachControllers(container: Container, controllers: NewableFunction[]) {
  for (const controller of controllers) {
    const _controller = controller as core.Constructor;
    container.register(_controller, { useClass: _controller });
  }
}
