import type { AnyRouter } from '@trpc/server';
import type { BaseHandlerResolver } from '@nammatham/core';
import type { ExpressServerOption } from '@nammatham/express';
import type { HttpRequest as AzureHttpRequest } from '@azure/functions';
import type { AzureFunctionsOptions } from 'trpc-azure-functions-adapter';

import express from 'express';
import { startExpress } from '@nammatham/express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { NammathamApp, logger, trimSlash } from '@nammatham/core';
import { AzureFunctionsTrigger } from '@nammatham/azure-functions';
import { wrapAzureFunctionsRequestHandler } from 'trpc-azure-functions-adapter';

import { createContext } from './trpc';

export interface TrpcAzureFunctionsPluginOption<TRouter extends AnyRouter> {
  prefix?: string;
  trpcOptions: AzureFunctionsOptions<TRouter, AzureHttpRequest>;
  expressPluginOption?: ExpressServerOption;
}

/**
 * tRPC plugin for AzureFunctions
 * Unstable, some features are not implemented yet.
 */

export function unstable__tRpcAzureFunctionsPlugin<TRouter extends AnyRouter>(option: TrpcAzureFunctionsPluginOption<TRouter>) {
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    logger.info(`Using plugin: tRPC for AzureFunctions`);

    const prefix = trimSlash(option?.prefix ?? '/trpc');

    const azureFunctionsTrigger = new AzureFunctionsTrigger();
    const trpcFunction = azureFunctionsTrigger
      .http('trpc', {
        authLevel: 'anonymous',
        route: prefix + '/{x:regex(^[^\\/]+$)}',
        methods: ['GET', 'POST'],
      })
      .handler(async ({ trigger, context }) => {
        const handler = wrapAzureFunctionsRequestHandler(option.trpcOptions);
        return handler(trigger, context);
      });
    app.addFunction(trpcFunction);

    const isDevelopment = option?.expressPluginOption?.isDevelopment ?? process.env.NAMMATHAM_ENV === 'development';
    if (!isDevelopment) {
      logger.debug('Skipping express server in development mode (trpc)');
      return;
    }

    const expressApp = option.expressPluginOption?.expressApp ?? express();
    const expressPrefix = option.expressPluginOption?.prefix ?? '/api';

    expressApp.use(
      `${expressPrefix}/${prefix}`,
      trpcExpress.createExpressMiddleware({
        router: option.trpcOptions.router,
        createContext,
      })
    );

    // TODO: Fix later, this is a workaround to remove trpc function from NammatamApp,
    // Thie will be empty NammatamApp with functions, e.g. only functions will register.
    // However, the `startExpress` only needs `functions` from NammatamApp.
    const nammathamAppWithoutTrpc = new NammathamApp(handlerResolver).addFunctions(
      ...app.functions.filter(func => func.name !== 'trpc')
    );

    startExpress(
      {
        handlerResolver,
        app: nammathamAppWithoutTrpc,
      },
      {
        ...option.expressPluginOption,
        expressApp,
      }
    );
  };
}
