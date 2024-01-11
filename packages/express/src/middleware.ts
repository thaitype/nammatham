// Adapted from: https://github.com/trpc/trpc/tree/main/packages/server/src/adapters/express.ts
import type express from 'express';
import type { HttpMethod } from '@nammatham/core';

import { logger } from '@nammatham/core';

import type { NammathamHttpHandlerOption } from './types';

interface NammathamAppRequestOption extends NammathamHttpHandlerOption {
  req: express.Request;
  res: express.Response;
}

export function trimSlash(str: string) {
  return str.replace(/^\/|\/$/g, '');
}

function isMatchPath(path1: string, path2: string) {
  return trimSlash(path1).toLowerCase() === trimSlash(path2).toLowerCase();
}

export async function registerNammathamApp({ app, req, res, handlerResolver, option }: NammathamAppRequestOption) {
  const allowAllFunctionsAccessByHttp = option?.allowAllFunctionsAccessByHttp ?? false;
  // FIXME: Consider to use express plugin in development mode only, match incoming path is lack of performance
  for (const func of app.functions) {
    if (func.endpointOption?.type === 'http') {
      if (!func.endpointOption.methods?.includes(req.method as HttpMethod)) {
        /**
         * Azure Functions will return 404 if the method is not matched.
         */
        return res.status(404);
      }
      if (isMatchPath(func.endpointOption.route, req.path)) {
        return await handlerResolver.resolveHandler(func, req, res);
      }
    } else {
      if (allowAllFunctionsAccessByHttp === false) continue;
      if (isMatchPath(func.name, req.path) && req.method === 'GET') {
        await handlerResolver.resolveHandler(func, req, res);
        return res
          .status(200)
          .send(
            `The function "${func.name}" has been executed sucessfully, however, this function is not HTTP trigger, but you can access it by HTTP GET method in development mode.`
          );
      }
    }
  }
  return res.status(404).send(`Path not found: ${req.path}`);
}

export function createExpressMiddleware(opts: NammathamHttpHandlerOption): express.Handler {
  return async (req, res) => {
    logger.debug(`Handling request for ${req.path}`);

    await registerNammathamApp({
      ...opts,
      req,
      res,
    });
  };
}
