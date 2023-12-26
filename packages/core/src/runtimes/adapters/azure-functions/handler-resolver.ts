import { BaseHandlerResolver } from '../../bases';
import { InvocationContext, LogHandler, LogLevel } from '@azure/functions';
import { AzureFunctionsEndpoint } from './types';
import type { Request, Response } from 'express';
import { HttpRequest } from './http/HttpRequest';
import { NammathamApp } from '../../nammatham-app';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../../core';

function logExecutedFunction(
  startTime: number,
  endpoint: AzureFunctionsEndpoint<HttpRequest, string>,
  context: InvocationContext
) {
  const endTime = performance.now();
  const durationMs = Math.floor(endTime - startTime);
  logger.info(
    `Executed 'Functions.${endpoint.name}' (Succeeded, Id=${context.invocationId}, Duration=${durationMs}ms)`
  );
}

function logHandler(level: LogLevel, ...args: any[]) {
  if (level === 'information') {
    logger.info(args[0], ...args.slice(1));
  } else if (level === 'error') {
    logger.error(args[0], ...args.slice(1));
  } else if (level === 'warning') {
    logger.warn(args[0], ...args.slice(1));
  } else if (level === 'debug') {
    logger.debug(args[0], ...args.slice(1));
  } else if (level === 'trace') {
    logger.trace(args[0], ...args.slice(1));
  } else {
    logger.info(args[0], ...args.slice(1));
  }
}

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override async resolveHandler(endpoint: AzureFunctionsEndpoint<HttpRequest, string>, req: Request, res: Response) {
    const context = new InvocationContext({
      invocationId: uuidv4(),
      functionName: endpoint.name,
      logHandler: logHandler
    });
    const startTime = performance.now();
    logger.info(
      `Executing 'Functions.${endpoint.name}' (Reason='This function was programmatically called via the host APIs.', Id=${context.invocationId})`
    );
    const result = await endpoint.invokeHandler(new HttpRequest(req), context);
    logExecutedFunction(startTime, endpoint, context);
    return result;
  }

  override async resolveRegisterHandler(app: NammathamApp) {
    logger.debug(`Starting using Azure Functions register handler`);

    for (const func of app.functions) {
      logger.debug(`Registering function "${func.name}"`);
      if (func.type !== 'azureFunctions') continue;
      func.registerFunc({
        ...func,
        handler: func.invokeHandler,
      });
    }
  }

  protected mockInvocationContext(): InvocationContext {
    return new InvocationContext();
  }
}
