import * as type from '@azure/functions';
import { StatusCodes } from 'http-status-codes';

// Logger Object

export type Logger = {
  /**
   * The recommended way to log data during invocation.
   * Similar to Node.js's `console.log`, but has integration with Azure features like application insights
   * Uses the 'information' log level
   */
  log: type.InvocationContext['log'];
  /**
   * The recommended way to log trace data (level 0) during invocation.
   * Similar to Node.js's `console.trace`, but has integration with Azure features like application insights
   */
  trace: type.InvocationContext['trace'];
  /**
   * The recommended way to log debug data (level 1) during invocation.
   * Similar to Node.js's `console.debug`, but has integration with Azure features like application insights
   */
  debug: type.InvocationContext['debug'];
  /**
   * The recommended way to log information data (level 2) during invocation.
   * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
   */
  info: type.InvocationContext['info'];
  /**
   * The recommended way to log warning data (level 3) during invocation.
   * Similar to Node.js's `console.warn`, but has integration with Azure features like application insights
   */
  warn: type.InvocationContext['warn'];
  /**
   * The recommended way to log error data (level 4) during invocation.
   * Similar to Node.js's `console.error`, but has integration with Azure features like application insights
   */
  error: type.InvocationContext['error'];
};

/**
 * HttpResponse from HttpTrigger
 * 
 * azure/functions v4.0.0-alpha.8
 * 
 * They don't export HttpResponse object, they binding in `HttpHandler` type
    ```
    export type HttpHandler = (
        request: HttpRequest,
        context: InvocationContext
    ) => FunctionResult<HttpResponseInit | HttpResponse>;
    ```
 * This type will extract from it.
    Make a Pull Request into the original project.
 */
export type HttpResponse = type.HttpResponseInit | type.HttpResponse;
const a = new type.HttpResponse({
  headers: { a: '' },
});

export type HttpStatus = StatusCodes | number;

export type InvocationContext = type.InvocationContext;
export type Request = type.HttpRequest;
/**
 * Http Response Builder
 */
export class Response {
  protected statusCode: HttpStatus = StatusCodes.OK;

  public send(body?: string) {
    return new type.HttpResponse();
  }

  public json(body: any) {
    return new type.HttpResponse();
  }

  public status(status: HttpStatus) {
    this.statusCode = status;
    return this;
  }
}
