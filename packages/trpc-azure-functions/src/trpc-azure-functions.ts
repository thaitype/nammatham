import { BaseHandlerResolver, NammathamApp, logger, trimSlash } from '@nammatham/core';
import { HttpRequest as AzureHttpRequest } from '@azure/functions';
import { AzureFunctionsOptions, wrapAzureFunctionsRequestHandler } from 'trpc-azure-functions-adapter';
import { AnyRouter } from '@trpc/server';
import { AzureFunctionsTrigger } from '@nammatham/azure-functions';
import { ExpressServerOption, startExpress } from '@nammatham/express';
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './trpc';

export interface TrpcAzureFunctionsPluginOption<TRouter extends AnyRouter> {
  prefix?: string;
  trpcOptions: AzureFunctionsOptions<TRouter, AzureHttpRequest>;
  expressPluginOption?: ExpressServerOption;
}

export function tRpcAzureFunctionsPlugin<TRouter extends AnyRouter>(option: TrpcAzureFunctionsPluginOption<TRouter>) {
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
      .handler(async (request, ctx) => {
        const handler = wrapAzureFunctionsRequestHandler(option.trpcOptions);
        return handler(request, ctx.context);
      });
    app.addFunction(trpcFunction);

    const isDevelopment = option?.expressPluginOption?.isDevelopment ?? process.env.NODE_ENV === 'development';
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
