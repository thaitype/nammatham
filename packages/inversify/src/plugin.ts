import type { Container, interfaces } from 'inversify';

import { type NammathamApp, type BaseHandlerResolver, type BaseHandler, logger } from '@nammatham/core';

export function inverisfyPlugin(options: {
  container: Container;
  services: interfaces.ServiceIdentifier[];
}): (app: NammathamApp, handlerResolver: BaseHandlerResolver) => void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    for (const service of options.services) {
      const instance = options.container.get(service);
      if (typeof instance !== 'object') {
        throw new Error(`Service ${service.toString()} is not an object`);
      }
      if (!instance) {
        throw new Error(`Service ${service.toString()} not found`);
      }
      app.addFunctions(...extractClassHandlers(instance));
    }
  };
}

function extractClassHandlers(classInstance: object) {
  const handlers: BaseHandler<any>[] = [];
  const fields = Object.entries(classInstance);
  fields.forEach(([methodName, method]) => {
    const handler = method as BaseHandler<any>;
    if (handler.__baseHandler) {
      logger.debug(
        `Adding handler from ${classInstance.constructor.name}.${methodName} with function name "${
          handler.build().name
        }"`
      );
      handlers.push(handler);
    }
  });
  return handlers;
}
