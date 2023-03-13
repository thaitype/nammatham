import * as type from '@azure/functions';
import { StatusCodes } from 'http-status-codes';
import { Headers } from 'undici';

/**
 * Re-export from Azure Functions;
 */
export type HttpResponse = type.HttpResponseInit | type.HttpResponse;
export type Request = type.HttpRequest;

/**
 * Http Response Builder wrapping around azure/functions
 */
export class Response {
  protected _headers: Headers;
  protected _cookies: NonNullable<type.HttpResponseInit['cookies']> = [];
  protected _httpResponse: type.HttpResponseInit;

  constructor(responseInit?: type.HttpResponseInit) {
    this._httpResponse = {
      ...responseInit,
      status: StatusCodes.OK,
    };
    this._headers = new Headers(responseInit?.headers);
  }

  get headers() {
    return this._headers;
  }

  get cookies() {
    return this._cookies;
  }

  private build(): type.HttpResponseInit {
    return {
      ...this._httpResponse,
      headers: this._headers,
      cookies: this._cookies.length === 0 ? undefined : this._cookies,
    };
  }

  public body(body?: string) {
    return new type.HttpResponse({
      ...this.build(),
      body,
    });
  }

  public jsonBody(jsonBody: any) {
    return new type.HttpResponse({
      ...this.build(),
      jsonBody,
    });
  }

  public httpResponse(responseInit?: type.HttpResponseInit) {
    return new type.HttpResponse(responseInit);
  }

  public status(status: StatusCodes | number) {
    this._httpResponse.status = status;
    return this;
  }
}
