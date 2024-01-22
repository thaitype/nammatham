import type { BaseHandlerResolver, NammathamApp } from '@nammatham/core';

import express from 'express';
import { logger, logo } from '@nammatham/core';
import { blue, gray, greenBright } from 'colorette';

import type { NammathamHttpHandlerOption } from './types';

import { createExpressMiddleware } from './middleware';

export interface ExpressServerOption {
  prefix?: string;
  port?: number;
  /**
   * @default localhost
   */
  hostname?: string;
  expressApp?: express.Express;
  dev?: boolean;
  allowAllFunctionsAccessByHttp?: boolean;
}

/**
 * Express Server Plugin
 */
export function expressPlugin(option?: ExpressServerOption) {
  return (app: NammathamApp, handlerResolver: BaseHandlerResolver) => {
    const isDevelopment = option?.dev ?? false;
    app.setDevelopment(isDevelopment);
    if (isDevelopment === false && app.runtime === 'azure-functions') {
      return;
    } else {
      logger.info('Starting express server in development mode');
    }
    app.setRuntime('express');
    logger.debug(`Using plugin: expressPlugin`);
    startExpress(
      {
        handlerResolver,
        app,
      },
      option
    );
  };
}

export function startExpress(
  { app, handlerResolver }: NammathamHttpHandlerOption,
  expressOption?: ExpressServerOption
) {
  logger.debug('Starting express server');
  const expressApp = expressOption?.expressApp ?? express();
  const port = expressOption?.port ?? 3000;
  const hostname = expressOption?.hostname ?? 'localhost';
  const prefix = expressOption?.prefix ?? '/api';
  const allowAllFunctionsAccessByHttp = expressOption?.allowAllFunctionsAccessByHttp ?? false;

  // https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code
  expressApp.disable('etag');
  expressApp.use(
    prefix,
    createExpressMiddleware({
      app,
      handlerResolver,
      option: {
        allowAllFunctionsAccessByHttp,
      },
      // createContext,
    })
  );

  expressApp.listen(port, hostname, async () => {
    console.clear();
    const endTime = performance.now();
    const durationMs = Math.floor(endTime - app.startTime);
    const hostType = hostname === 'localhost' ? 'Local' : 'Host';
    // const host = hostname === 'localhost' ? gray('Not Available') : greenBright(`http://${hostname}:${port}`);
    logger.debug(`Server started at http://${hostname}:${port}`);
    console.log(`${await logo()}  ${gray(`ready in ${durationMs} ms`)}\n`);
    console.log(`\n${blue('Express server started')}\n`);
    // console.log(` ┃ Local  ${greenBright(`http://localhost:${port}`)}`);
    console.log(` ┃ ${hostType}   ${greenBright(`http://${hostname}:${port}`)} \n`);

    await handlerResolver.afterServerStarted(app, { port, hostname, allowAllFunctionsAccessByHttp });
    console.log('\n');
  });
}
