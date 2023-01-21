import { Context } from '@azure/functions';
import { StatusCodes } from 'http-status-codes';

export interface ISendOption<T> {
  status: StatusCodes | number;
  body: T;
}

export class HttpResponse {
  constructor(protected readonly context: Context) {}

  public send<T>({ status = StatusCodes.OK, body }: ISendOption<T>) {
    this.context.res = {
      status,
      body,
    };
  }

  public ok<T>(body: T) {
    this.send<T>({
      status: StatusCodes.OK,
      body,
    });
  }
}
