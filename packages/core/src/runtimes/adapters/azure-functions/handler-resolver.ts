import { BaseHandlerResolver } from '../../bases';
import { InvocationContext, LogLevel } from '@azure/functions';
import { AzureFunctionsEndpoint } from './types';
import type { Request, Response } from 'express';
import { HttpRequest } from './http/HttpRequest';
import { NammathamApp } from '../../nammatham-app';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../../core';
import { printRegisteredFunctions } from './utils';
import { AfterServerStartedMetadata } from '../../types';
import { yellow } from 'colorette';

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

function warnUnsupportedFeature(endpoint: AzureFunctionsEndpoint<HttpRequest, string>) {
  if(endpoint.extraInputs.length > 0 || endpoint.extraOutputs.length > 0) {
    logger.warn(`${yellow(`Dev Server middleware does not support extra inputs or outputs for Azure Functions yet, please run 'func start' to test your function locally`)}`);
  }
}

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override async resolveHandler(endpoint: AzureFunctionsEndpoint<HttpRequest, string>, req: Request, res: Response) {
    const context = new InvocationContext({
      invocationId: uuidv4(),
      functionName: endpoint.name,
      logHandler: logHandler,
    });
    const startTime = performance.now();
    warnUnsupportedFeature(endpoint);
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
    const azureFunctions = app.functions.filter(func => func.type === 'azureFunctions') as AzureFunctionsEndpoint<
      any,
      any
    >[];

    if (azureFunctions.length === 0) {
      logger.warn(`\n\n${yellow('No functions registered, did you forget to add functions?')}\n`);
    }

    if (process.env.NODE_ENV === 'development') {
      logger.debug(`Skipping Register Azure Function handler in development mode`);
      return;
    }
    for (const func of azureFunctions) {
      logger.debug(`Registering function "${func.name}"`);
      func.registerFunc({
        ...func,
        handler: func.invokeHandler,
      });
    }
    logger.debug(`Registered ${azureFunctions.length} functions`);
  }

  override async afterServerStarted(app: NammathamApp, metadata: AfterServerStartedMetadata) {
    return printRegisteredFunctions(app, metadata.port);
  }

  protected mockInvocationContext(): InvocationContext {
    return new InvocationContext();
  }
}
