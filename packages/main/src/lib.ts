import type { HandlerResponse, MiddlewareHandler } from 'hono/types';

import { createMiddleware } from 'hono/factory';

export interface HttpTriggerOptions<TRoute extends string> {
  methods?: string[];
  authLevel?: 'anonymous' | 'function' | 'admin';
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  handler?: () => void;
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
export type FetchCallback = (request: Request, env: Record<string, unknown>) => Promise<Response> | Response;

export class Nammatham {
  handle(fetch: FetchCallback): HttpTriggerOptions<string>['handler'] {
    return {} as any;
  }

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
