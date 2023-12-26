import express from 'express';
import * as nammathamExpress from '../adapters/express';
import { BaseHandlerResolver, NammathamApp } from '../../runtimes';
import { NammathamHttpHandlerOption } from '../types';
import { logger } from '../../core';

export interface DevServerOption {
  port?: number;
  expressApp?: express.Express;
}
export function devServer(option?: DevServerOption) {
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    if (process.env.NODE_ENV !== 'development') {
      logger.debug('Not in development mode, skip starting dev server');
      return;
    }
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
  logger.info('Starting express server');
  const expressApp = devOption?.expressApp ?? express();
  const port = devOption?.port ?? 3000;

  expressApp.use(
    '/api',
    nammathamExpress.createExpressMiddleware({
      app,
      handlerResolver,
      // createContext,
    })
  );

  expressApp.listen(port, () => {
    logger.info(`Dev server started on port ${port}`);
  });
}
