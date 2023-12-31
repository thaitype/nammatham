import express from 'express';
import { createExpressMiddleware } from './middleware';
import { BaseHandlerResolver, NammathamApp, logger } from '@nammatham/core';
import { NammathamHttpHandlerOption } from './types';

export interface ExpressServerOption {
  prefix?: string;
  port?: number;
  expressApp?: express.Express;
  isDevelopment?: boolean;
}

/**
 * Express Server Plugin
 */
export function expressPlugin(option?: ExpressServerOption) {
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    const isDevelopment = option?.isDevelopment ?? process.env.NAMMATHAM_ENV === 'development';
    if (!isDevelopment) {
      logger.debug('Skipping express server in development mode');
      return;
    }
    logger.info(`Using plugin: expressPlugin`);
    startExpress(
      {
        handlerResolver,
        app,
      },
      option
    );
  };
}

export function startExpress({ app, handlerResolver }: NammathamHttpHandlerOption, expressOption?: ExpressServerOption) {
  logger.debug('Starting express server');
  const expressApp = expressOption?.expressApp ?? express();
  const port = expressOption?.port ?? 3000;
  const prefix = expressOption?.prefix ?? '/api';

  // https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
  expressApp.disable('etag');
  expressApp.use(
    prefix,
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
