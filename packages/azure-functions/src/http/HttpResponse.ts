import { Headers } from 'undici';
import * as type from '@azure/functions';

/**
 * Re-export from Azure Functions;
 */
export type AzureHttpResponse = type.HttpResponseInit | type.HttpResponse;
export type Request = type.HttpRequest;

/**
 * Http Response Builder wrapping around azure/functions
 */
export class HttpResponse {
  protected _headers: Headers;
  protected _cookies: NonNullable<type.HttpResponseInit['cookies']> = [];
  protected _httpResponse: type.HttpResponseInit;

  constructor(responseInit?: type.HttpResponseInit) {
    this._httpResponse = {
      ...responseInit,
      status: 200,
    };
    this._headers = new Headers(responseInit?.headers);
  }

  private build(): type.HttpResponseInit {
    return {
      ...this._httpResponse,
      headers: this._headers,
      cookies: this._cookies.length === 0 ? undefined : this._cookies,
    };
  }

  public text(body?: string) {
    return new type.HttpResponse({
      ...this.build(),
      body,
    });
  }

  public json<T extends object>(jsonBody: T) {
    return new type.HttpResponse({
      ...this.build(),
      jsonBody,
    });
  }

  public httpResponse(responseInit?: type.HttpResponseInit) {
    return new type.HttpResponse(responseInit);
  }

  public header(key: string, value: string) {
    this._headers.set(key, value);
    return this;
  }

  public headers(headers: Record<string, string>) {
    for (const [key, value] of Object.entries(headers)) {
      this._headers.set(key, value);
    }
    return this;
  }

  public status(status: number) {
    this._httpResponse.status = status;
    return this;
  }
}
