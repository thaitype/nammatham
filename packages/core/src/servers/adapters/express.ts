// Adapted from: https://github.com/trpc/trpc/packages/server/src/adapters/express.ts
import express from 'express';
import { NammathamApp } from '../../runtimes';

interface NodeHTTPHandlerOptions {
  app: NammathamApp;
}

interface NammathamAppRequestOption extends NodeHTTPHandlerOptions {
  req: express.Request;
  res: express.Response;
}

function trimSlash(str: string) {
  return str.replace(/^\/|\/$/g, '');
}

function isMatchPath(path1: string, path2: string) {
  return trimSlash(path1).toLowerCase() === trimSlash(path2).toLowerCase();
}

export function registerNammathamApp({ app, req, res }: NammathamAppRequestOption) {
  for (const func of app.functions) {
    if (func.functionType !== 'http') continue;
    if (isMatchPath(func.route, req.path)) {
      // TODO: Call func.invokeHandler
      return res.send(`Executing function: ${req.path}`);
    }
  }
  res.send(`Path not found: ${req.path}`);
}

export function createExpressMiddleware(opts: NodeHTTPHandlerOptions): express.Handler {
  return async (req, res) => {
    console.debug(`Handling request for ${req.path}`);

    registerNammathamApp({
      ...opts,
      req,
      res,
    });
  };
}
