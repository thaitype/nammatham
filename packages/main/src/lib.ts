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

// export interface HttpTriggerOptions {
//   authLevel?: 'anonymous' | 'function' | 'admin';
//   inputs?: Record<string, unknown>;
//   outputs?: Record<string, unknown>;
// }

// type Env<Inputs extends Record<string, unknown> = any, Outputs extends Record<string, unknown> = any> = {
//   Variables: {
//     inputs: Inputs;
//     outputs: Outputs;
//     echo: (str: string) => string;
//   };
// };

// export function createHttp(
//   option: HttpTriggerOptions,
//   handler: Handler<Env, any, Input, HandlerResponse<any>> | MiddlewareHandler<Env, any, Input>
// ) {
//   const factory = createFactory<Env>();
//   const middleware = factory.createMiddleware(async (c, next) => {
//     // Do something
//     await next();
//   });

//   const httpHandlers = factory.createHandlers(middleware, handler);
//   return httpHandlers;
// }

type Env = {
  Variables: {
    func: {
      invocationId: string;
      inputs: Record<string, any>;
    };
  };
};

export class HonoFunctionTrigger {
  http<const TRoute extends string>(options: { route: TRoute }) {
    const middleware = createMiddleware<Env>(async (c, next) => {
      c.set('func', {
        invocationId: c.req.header('x-azure-functions-invocationid') || '',
        inputs: {},
      });
      await next();
    });
    return [options.route, middleware] as const;
    // console.log('options.route', options.route);
    // return middleware;
  }
}
