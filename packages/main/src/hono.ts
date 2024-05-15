import type { MiddlewareHandler } from 'hono/types';

import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';

import type { HttpTriggerOptions, InvocationContext } from './types';

export class Nammatham {
  protected hono: Hono;
  constructor() {
    this.hono = new Hono();
  }

  public getApp() {
    return this.hono;
  }
}

type HonoEnv = {
  Variables: {
    context: InvocationContext;
  };
};

export class HonoAzureMiddleware {
  http<const TRoute extends string>(options: HttpTriggerOptions<TRoute>): [TRoute, MiddlewareHandler<HonoEnv>] {
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
