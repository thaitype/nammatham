import type { Handler, Input } from 'hono';
import type { HandlerResponse, MiddlewareHandler } from 'hono/types';

import { Hono } from 'hono';
import { createFactory } from 'hono/factory';

export class Nammatham {
  protected hono: Hono;
  constructor() {
    this.hono = new Hono();
  }

  public getApp() {
    return this.hono;
  }
}

interface HttpTriggerOptions {
  authLevel?: 'anonymous' | 'function' | 'admin';
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
}

type Env<Inputs extends Record<string, unknown> = any, Outputs extends Record<string, unknown> = any> = {
  Variables: {
    inputs: Inputs;
    outputs: Outputs;
  };
};

export function createHttp(
  option: HttpTriggerOptions,
  handler: Handler<Env, any, Input, HandlerResponse<any>> | MiddlewareHandler<Env, any, Input>
) {
  const factory = createFactory<Env>();
  const middleware = factory.createMiddleware(async (c, next) => {
    // Do something
    await next();
  });

  const httpHandlers = factory.createHandlers(middleware, handler);
  return httpHandlers;
}
