import camelCase from 'lodash.camelcase';

import type { NammathamFunction, HttpTriggerOptions, NammathamTrigger } from './types';

export class Nammatham implements NammathamTrigger {
  protected functions: NammathamFunction[] = [];

  public get<T extends string>(route: T) {
    return this.http({
      route,
      methods: ['GET'],
    });
  }

  public post<T extends string>(route: T) {
    return this.http({
      route,
      methods: ['POST'],
    });
  }

  public http<T extends string>(options: HttpTriggerOptions<T>) {
    if (options.route === undefined && options.name === undefined) {
      throw new Error('Route or Name is required');
    }
    this.functions.push({
      name: camelCase(options.name ?? options.route),
      metadata: {
        bindings: [
          {
            type: 'httpTrigger',
            // TODO: Add Support default value by configuring in options
            authLevel: options.authLevel ?? 'function',
            route: options.route,
            direction: 'in',
            name: 'req',
            methods: options.methods ?? ['GET', 'POST', 'PUT', 'DELETE'],
          },
          {
            type: 'http',
            direction: 'out',
            name: 'res',
          },
        ],
      },
    });
    return this;
  }

  public getFunctions() {
    return this.functions;
  }
}
