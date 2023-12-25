// Adapted from: https://github.com/trpc/trpc/packages/server/src/adapters/express.ts
import express from 'express';
import { NammathamHttpHandlerOption } from '../types';

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

export function registerNammathamApp({ app, req, res, handlerResolver }: NammathamAppRequestOption) {
  // FIXME: Match path using array loop is lack of performance
  for (const func of app.functions) {
    if (func.functionType !== 'http') continue;
    if (isMatchPath(func.route, req.path)) {
      // TODO: Call func.invokeHandler
      handlerResolver.resolveHandler();
      return res.send(`Executing function: ${req.path}`);
    }
  }
  res.send(`Path not found: ${req.path}`);
}

export function createExpressMiddleware(opts: NammathamHttpHandlerOption): express.Handler {
  return async (req, res) => {
    console.debug(`Handling request for ${req.path}`);

    registerNammathamApp({
      ...opts,
      req,
      res,
    });
  };
}
