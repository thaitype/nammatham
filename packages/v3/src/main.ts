import type { Env, Hono, Schema } from 'hono';

import { type BaseHandler } from '@nammatham/core';
import { AzureFunctionsAdapter } from '@nammatham/azure-functions';

const adapter = new AzureFunctionsAdapter();

export const nammatham = {
  create() {
    return adapter.createTrigger();
  },

  // eslint-disable-next-line @typescript-eslint/ban-types
  handle<E extends Env = Env, S extends Schema = {}, BasePath extends string = '/'>(option: {
    dev?: boolean;
    app?: Hono<E, S, BasePath>;
    triggers?: Record<string, BaseHandler<any>>;
  }) {
    const nammathamApp = adapter.createApp();
    nammathamApp.setDevelopment(option.dev ?? false);
    if (option.triggers) {
      nammathamApp.addFunctions(...Object.values(option.triggers));
    }
    // TODO: Use Hono as a dev server
    // nammathamApp.register(expressplugin());

    nammathamApp.start();
    if (option.app) return nammatham.handleHono(option.app);
  },

  // eslint-disable-next-line @typescript-eslint/ban-types
  handleHono<E extends Env = Env, S extends Schema = {}, BasePath extends string = '/'>(app: Hono<E, S, BasePath>) {
    console.log('app', app);

    // From https://github.dev/honojs/hono/src/adapter/aws-lambda/handler.ts
    // const req = createRequest(event)
    // const requestContext = getRequestContext(event)

    // const res = await app.fetch(req, {
    //   event,
    //   requestContext,
    //   lambdaContext,
    // })

    // return createResult(event, res)
  },
};
