import { BaseHandlerResolver, NammathamApp, logger, AfterServerStartedMetadata } from '@nammatham/core';
import { Cookie, HttpResponse, InvocationContext, LogLevel } from '@azure/functions';
import { AzureFunctionsEndpoint } from './types';
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  CookieOptions as ExpressCookieOptions,
} from 'express';
import { HttpRequest } from './http/HttpRequest';
import { v4 as uuidv4 } from 'uuid';
import { printRegisteredFunctions, printRegisteredNonHttpFunctions } from './utils';
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
  if (endpoint.extraInputs.length > 0 || endpoint.extraOutputs.length > 0) {
    logger.warn(
      `${yellow(
        `Dev Server middleware does not support extra inputs or outputs for Azure Functions yet, please run 'func start' to test your function locally`
      )}`
    );
  }
}

function convertHttpResponseCookieToExpressCookie(res: ExpressResponse, cookies: Cookie[]): void {
  const convertSameSiteToExpressSameSite = (sameSite: Cookie['sameSite']): ExpressCookieOptions['sameSite'] => {
    if (sameSite === 'None') {
      return 'none';
    } else if (sameSite === 'Strict') {
      return 'strict';
    } else if (sameSite === 'Lax') {
      return 'lax';
    } else {
      return false;
    }
  };

  for (const cookie of cookies) {
    res.cookie(cookie.name, cookie.value, {
      domain: cookie.domain,
      expires: typeof cookie.expires === 'number' ? new Date(cookie.expires) : cookie.expires,
      httpOnly: cookie.httpOnly,
      maxAge: cookie.maxAge,
      path: cookie.path,
      sameSite: convertSameSiteToExpressSameSite(cookie.sameSite),
      secure: cookie.secure,
    });
  }
}

function convertHttpResponseHeadersToExpressHeaders(headers: HttpResponse['headers']): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of headers) {
    result[key] = value;
  }
  return result;
}

/**
 * Convert HttpResponse to ExpressResponse, make sure Headers and Cookies
 * are set correctly and follow Kestrel server by Azure Functions
 */

async function convertHttpResponseToExpressResponse(res: ExpressResponse, response: HttpResponse) {
  convertHttpResponseCookieToExpressCookie(res, response.cookies);
  res.removeHeader('Keep-Alive');
  res.removeHeader('Connection');
  res.writeHead(response.status, convertHttpResponseHeadersToExpressHeaders(response.headers));
  res.write(await response.text());
  return res.end();
}

export class AzureFunctionsHandlerResolver extends BaseHandlerResolver {
  override async resolveHandler(
    endpoint: AzureFunctionsEndpoint<HttpRequest, string>,
    req: ExpressRequest,
    res: ExpressResponse<string>
  ) {
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
      if (result === undefined) return;
      const response = result instanceof HttpResponse ? result : new HttpResponse(result);
      return await convertHttpResponseToExpressResponse(res, response);
    } catch (error) {
      logExecutedFunction(startTime, endpoint, context, 'Failed');
      logger.error(error);
      return res.status(500).send();
    }
  }

  override async resolveRegisterHandler(app: NammathamApp) {
    logger.debug(`Starting using Azure Functions register handler`);
    const azureFunctions = app.functions.filter(func => func.type === 'azure-functions') as AzureFunctionsEndpoint<
      any,
      any
    >[];

    if (azureFunctions.length === 0) {
      logger.warn(`\n\n${yellow('No functions registered, did you forget to add functions?')}\n`);
    }

    logger.info(`Running with runtime: ${app.runtime}`);
    console.log(`runtime: ${app.runtime}, isDevelopment: ${app.isDevelopment}`);

    if (app.runtime === 'express' && process.env.NAMMATHAM_ENV !== 'development') {
      throw new Error(
        `expressPlugin will not start express server in production mode for Azure Functions Adapter, because Azure Functions will start the server for us.
        Please make set isDevelopment to be 'false' when use expressPlugin in production mode.`
      );
    }
    if (app.isDevelopment === true) {
      logger.info(`Running in development mode`);
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
    await printRegisteredFunctions(app, metadata);
    await printRegisteredNonHttpFunctions(app, metadata);
  }

  protected mockInvocationContext(): InvocationContext {
    return new InvocationContext();
  }
}
