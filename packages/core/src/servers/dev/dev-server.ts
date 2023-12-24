import express from 'express';
import { NammathamApp } from '../../runtimes';
export interface DevServerOption {
  port: number;
  app: NammathamApp;
  expressApp?: express.Express;
}
export function devServer(option: DevServerOption) {
  if (process.env.NODE_ENV !== 'development') {
    console.debug('Not in development mode, skip starting dev server');
    return;
  }
  console.log(`Starting dev server on port ${option.port}`);
  startExpress(option);
}

export function startExpress(option: DevServerOption) {
  console.log('Starting express server');
  const app = option.expressApp ?? express();

  // app.use(
  //   '/api',
  //   nExpress.createExpressMiddleware({
  //     functionApp,
  //     createContext,
  //   })
  // );

  app.listen(2021, () => {
    console.log('listening on port 2021');
  });
}
