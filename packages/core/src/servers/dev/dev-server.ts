import express from 'express';
import * as nammathamExpress from '../adapters/express';
import { NammathamApp } from '../../runtimes';

export interface DevServerOption {
  port?: number;
  expressApp?: express.Express;
}
export function devServer(option?: DevServerOption) {
  return (app: NammathamApp) => {
    if (process.env.NODE_ENV !== 'development') {
      console.debug('Not in development mode, skip starting dev server');
      return;
    }
    startExpress(app, option);
  };
}

export function startExpress(app: NammathamApp, option?: DevServerOption) {
  console.log('Starting express server');
  const expressApp = option?.expressApp ?? express();
  const port = option?.port ?? 3000;

  expressApp.use(
    '/api',
    nammathamExpress.createExpressMiddleware({
      app,
      // createContext,
    })
  );

  expressApp.listen(port, () => {
    console.log(`Dev server started on port ${port}`);
  });
}
