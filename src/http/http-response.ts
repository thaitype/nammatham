import { Context } from '@azure/functions';
import { StatusCodes } from 'http-status-codes';

type HttpStatus = StatusCodes | number;

export interface ISendOption<T> {
  status: HttpStatus;
  body: T;
}

export class HttpResponse {
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

  public status(status: HttpStatus){
    this.statusCode = status;
    return this;
  }
}
