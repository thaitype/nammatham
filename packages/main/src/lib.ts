import type { HandlerResponse, MiddlewareHandler } from 'hono/types';

import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';

export class Nammatham {
  protected hono: Hono;
  constructor() {
    this.hono = new Hono();
  }

  public getApp() {
    return this.hono;
  }
}

export interface HttpTriggerOptions<TRoute extends string> {
  authLevel?: 'anonymous' | 'function' | 'admin';
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  route?: TRoute;
}

type HonoEnv = {
  Variables: {
    func: {
      invocationId: string;
      inputs: Record<string, any>;
      json: (data: any) => HandlerResponse<any>;
      log: (message: string) => void;
    };
  };
};

export class FunctionTrigger {
  http<const TRoute extends string>(options: HttpTriggerOptions<TRoute>): [TRoute, MiddlewareHandler<HonoEnv>] {
    const middleware = createMiddleware<HonoEnv>(async (c, next) => {
      const logMessages: string[] = [];
      c.set('func', {
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
