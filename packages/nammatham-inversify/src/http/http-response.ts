import { Context as FunctionContext, HttpResponse } from '@azure/functions';
import { StatusCodes } from 'http-status-codes';

type HttpStatus = StatusCodes | number;

export interface ISendOption<T> {
  status: HttpStatus;
  body: T;
}

type Dictionary = {
  [key: string]: any;
};

// type HttpResponse = Dictionary & {
//   status?: HttpStatus;
//   body?: any;
// };

export interface Context extends FunctionContext {
  /**
   * Add prop from the base interface
   */
  res?: HttpResponse;
}

export class HttpResponseContext {
  private statusCode: HttpStatus = StatusCodes.OK;

  constructor(protected readonly context: Context) {}

  public send(body?: string) {
    this.context.res = {
      status: this.statusCode,
      body,
    };
  }

  public json(body: any) {
    this.context.res = {
      status: this.statusCode,
      body: JSON.stringify(body),
    };
  }

  public status(status: HttpStatus) {
    this.statusCode = status;
    return this;
  }
}