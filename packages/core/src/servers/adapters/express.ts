// Adapted from: https://github.com/trpc/trpc/packages/server/src/adapters/express.ts
import express from 'express';
import { NammathamHttpHandlerOption } from '../types';
import { logger } from '../../core';

interface NammathamAppRequestOption extends NammathamHttpHandlerOption {
  req: express.Request;
  res: express.Response;
}

function trimSlash(str: string) {
  return str.replace(/^\/|\/$/g, '');
}

function isMatchPath(path1: string, path2: string) {
  return trimSlash(path1).toLowerCase() === trimSlash(path2).toLowerCase();
}

export async function registerNammathamApp({ app, req, res, handlerResolver }: NammathamAppRequestOption) {
  // FIXME: Match path using array loop is lack of performance
  for (const func of app.functions) {
    if (func.endpointOption?.type !== 'http') continue;
    logger.info(`Allow all HTTP methods`);
    if (isMatchPath(func.endpointOption.route, req.path)) {
      return await handlerResolver.resolveHandler(func, req, res);
    }
  }
  res.status(404).send(`Path not found: ${req.path}`);
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
