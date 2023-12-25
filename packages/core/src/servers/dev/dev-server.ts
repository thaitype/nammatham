import express from 'express';
import * as nammathamExpress from '../adapters/express';
import { BaseHandlerResolver, NammathamApp } from '../../runtimes';
import { NammathamHttpHandlerOption } from '../types';

export interface DevServerOption {
  port?: number;
  expressApp?: express.Express;
}
export function devServer(option?: DevServerOption) {
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    if (process.env.NODE_ENV !== 'development') {
      console.debug('Not in development mode, skip starting dev server');
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
  console.log('Starting express server');
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
    console.log(`Dev server started on port ${port}`);
  });
}
