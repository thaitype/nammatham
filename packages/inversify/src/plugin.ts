import type { Container, interfaces } from 'inversify';
import type { NammathamApp, BaseHandlerResolver } from '@nammatham/core';

export function inverisfyPlugin(options: {
  container: Container;
  services: interfaces.ServiceIdentifier[];
}): (app: NammathamApp, handlerResolver: BaseHandlerResolver) => void {
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    for (const service of options.services) {
      const controller = options.container.get(service);
      // app.addFunctions(controller, handlerResolver);
    }
  };
}
