import express from 'express';
import * as nammathamExpress from './middleware';
import { BaseHandlerResolver, NammathamApp } from '../core';
import { NammathamHttpHandlerOption } from './types';
import { logger } from '../core';

export interface DevServerOption {
  port?: number;
  expressApp?: express.Express;
}

/**
 * Express Server Plugin
 */
export function expressServer(option?: DevServerOption) {
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    logger.info(`Using plugin: expressServer`);
    startExpress(
      {
        handlerResolver,
        app,
      },
      option
    );
  };
}

export function startExpress({ app, handlerResolver }: NammathamHttpHandlerOption, devOption?: DevServerOption) {
  logger.debug('Starting express server');
  const expressApp = devOption?.expressApp ?? express();
  const port = devOption?.port ?? 3000;

  // https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
  expressApp.disable('etag');
  expressApp.use(
    '/api',
    nammathamExpress.createExpressMiddleware({
      app,
      handlerResolver,
      // createContext,
    })
  );

  expressApp.listen(port, async () => {
    logger.info(`Dev Server started at http://localhost:${port}`);
    await handlerResolver.afterServerStarted(app, { port });
  });
}
