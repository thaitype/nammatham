import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';

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
  }
}

// const func = new HonoFunctionTrigger();

// const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || '4000');
// console.log(`Start server on on http://localhost:${port}`);

// export default {
//   port,
//   fetch: app.fetch,
//   func,
// };