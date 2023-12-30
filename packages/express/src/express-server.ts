import express from 'express';
import { createExpressMiddleware } from './middleware';
import { BaseHandlerResolver, NammathamApp, logger } from '@nammatham/core';
import { NammathamHttpHandlerOption } from './types';

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
    createExpressMiddleware({
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
