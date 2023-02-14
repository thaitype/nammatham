import { StatusCodes } from 'http-status-codes';
import { HttpResponse } from '@azure/functions';
import { TypedContext } from './interfaces';

export type HttpStatus = StatusCodes | number;

export interface ISendOption<T> {
  status: HttpStatus;
  body: T;
}

export class HttpResponseContext {
  protected statusCode: HttpStatus = StatusCodes.OK;

  constructor(protected readonly context: TypedContext<any>) {}

  public send(body?: string): HttpResponse {
    const res: HttpResponse = {
      status: this.statusCode,
      body,
    };
    this.context.res = res;
    return res;
  }

  public json(body: any): HttpResponse {
    const res: HttpResponse = {
      status: this.statusCode,
      body: JSON.stringify(body),
    };
    this.context.res = res;
    return res;
  }

  public status(status: HttpStatus) {
    this.statusCode = status;
    return this;
  }

  public setHttpResponse(response: HttpResponse): HttpResponse{
    return response;
  }
}
