import type { MiddlewareHandler } from 'hono/types';

import { createMiddleware } from 'hono/factory';

import type { HttpTriggerOptions, InvocationContext } from './types';

import { NammathamBase } from './nammatham';

type HonoEnv = {
  Variables: {
    context: InvocationContext;
  };
};

export class HonoAzureMiddleware extends NammathamBase {
  public get<T extends string>(route: T) {
    return this.http({
      method: ['GET'],
      route,
    });
  }

  public post<T extends string>(route: T) {
    return this.http({
      method: ['POST'],
      route,
    });
  }

  http<const TRoute extends string>(options: HttpTriggerOptions<TRoute>): [TRoute, MiddlewareHandler<HonoEnv>] {
    this.http(options);
    const middleware = createMiddleware<HonoEnv>(async (c, next) => {
      const logMessages: string[] = [];
      c.set('context', {
        invocationId: c.req.header('x-azure-functions-invocationid') || '',
        inputs: {},
        log: (message: string) => {
          logMessages.push(message);
        },
        json: data => {
          return c.json({
            Outputs: {
              res: {
                StatusCode: 200,
                Body: data,
                headers: {
                  'content-type': 'application/json',
                },
              },
            },
            Logs: logMessages,
            // ReturnValue: '{"hello":"world"}',
          });
        },
      });
      await next();
    });
    return [options.route as TRoute, middleware] as const;
  }
}
