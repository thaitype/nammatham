import * as type from '@azure/functions';

/**
 * Re-export from Azure Functions;
 */
export type AzureHttpResponse = type.HttpResponseInit | type.HttpResponse;
export type Request = type.HttpRequest;

/**
 * Http Response Builder wrapping around azure/functions
 */
export type Header = Record<string, string>;
export class HttpResponse {
  protected _headers: Header;
  protected _cookies: NonNullable<type.HttpResponseInit['cookies']> = [];
  protected _httpResponse: type.HttpResponseInit;

  constructor(responseInit?: Omit<type.HttpResponseInit, 'headers'> & { headers: Header }) {
    this._httpResponse = {
      ...responseInit,
    };
    this._headers = responseInit?.headers ?? {};
  }

  private build(): type.HttpResponseInit {
    const result = {
      ...this._httpResponse,
    };
    if (Object.values(this._headers).length > 0) {
      result.headers = this._headers;
    }

    if (this._cookies.length > 0) {
      result.cookies = this._cookies;
    }
    return result;
  }

  public text(body?: string) {
    return new type.HttpResponse({
      ...this.build(),
      body,
    });
  }

  public json<T extends object>(jsonBody: T): AzureHttpResponse {
    return {
      ...this.build(),
      jsonBody,
    };
  }

  public httpResponse(responseInit?: type.HttpResponseInit) {
    return new type.HttpResponse(responseInit);
  }

  public header(key: string, value: string) {
    this._headers[key] = value;
    return this;
  }

  public headers(headers: Header) {
    for (const [key, value] of Object.entries(headers)) {
      this._headers[key] = value;
    }
    return this;
  }

  public status(status: number) {
    this._httpResponse.status = status;
    return this;
  }
}
