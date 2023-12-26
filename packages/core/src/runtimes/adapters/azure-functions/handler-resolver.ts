import { BaseHandlerResolver } from '../../bases';
import { InvocationContext, LogHandler, LogLevel } from '@azure/functions';
import { AzureFunctionsEndpoint } from './types';
import type { Request, Response } from 'express';
import { HttpRequest } from './http/HttpRequest';
import { NammathamApp } from '../../nammatham-app';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../../core';
import { stat } from 'fs';
import { log } from 'console';

function logExecutedFunction(
  startTime: number,
  endpoint: AzureFunctionsEndpoint<HttpRequest, string>,
  context: InvocationContext,
  status: 'Succeeded' | 'Failed'
) {
  const endTime = performance.now();
  const durationMs = Math.floor(endTime - startTime);
  const loggerLevel = status === 'Succeeded' ? 'info' : 'error';
  logger[loggerLevel](
    `Executed 'Functions.${endpoint.name}' (${status}, Id=${context.invocationId}, Duration=${durationMs}ms)`
  );
}

/**
 * Map InvocationContext log level to logger
 */

function logHandler(level: LogLevel, ...args: any[]) {
  if (level === 'information') {
    logger.info(...args);
  } else if (level === 'error') {
    logger.error(...args);
  } else if (level === 'warning') {
    logger.warn(...args);
  } else if (level === 'debug') {
    logger.debug(...args);
  } else {
    logger.info(...args);
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
    let result: any;
    try {
      result = await endpoint.invokeHandler(new HttpRequest(req), context);
      logExecutedFunction(startTime, endpoint, context, 'Succeeded');
      return res.send(result);
    } catch (error) {
      logExecutedFunction(startTime, endpoint, context, 'Failed');
      logger.error(error);
      return res.status(500).send();
    }
    
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
