// Adapted from: https://github.com/trpc/trpc/packages/server/src/adapters/express.ts
import express from 'express';
import { NammathamApp } from '../../runtimes';

interface NodeHTTPHandlerOptions {
  functionApp: NammathamApp;
}

export function createExpressMiddleware(opts: NodeHTTPHandlerOptions): express.Handler {
  return async (req, res) => {
    console.log(`Handling request for ${req.path}`);

    // TODO: Implement later
    if (req.path === '/aaa') {
      res.send(`Executing function: ${req.path}`);
    } else if (req.path === '/bbb') {
      res.send(`Executing function: ${req.path}`);
    } else {
      res.send(`Path not found: ${req.path}`);
    }
  };
}
