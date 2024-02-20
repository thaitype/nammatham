import type { Hono } from 'hono';

import { type BaseHandler } from '@nammatham/core';
import { AzureFunctionsAdapter } from '@nammatham/azure-functions';

interface NammathamHandleOptions {
  dev?: boolean;
  app?: Hono;
  triggers?: Record<string, BaseHandler<any>>;
}

const adapter = new AzureFunctionsAdapter();

export const nammatham = {
  create() {
    return adapter.createTrigger();
  },

  handle(option: NammathamHandleOptions) {
    const nammathamApp = adapter.createApp();
    nammathamApp.setDevelopment(option.dev ?? false);
    if (option.triggers) {
      nammathamApp.addFunctions(...Object.values(option.triggers));
    }
    // TODO: Use Hono as a dev server
    // nammathamApp.register(expressplugin());
    nammathamApp.start();
  },
};
