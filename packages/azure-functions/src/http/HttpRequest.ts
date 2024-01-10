// Adapted from https://github.com/Azure/azure-functions-nodejs-library/blob/v4.x/src/http/HttpRequest.ts
import type * as types from '@azure/functions';
import type { HttpRequestParams, HttpRequestUser } from '@azure/functions';
import type { Blob } from 'buffer';
import type express from 'express';
import type { URLSearchParams } from 'url';
import type { ReadableStream } from 'stream/web';
import type { FormData, Headers } from 'undici';
import { logger } from '@nammatham/core';
import { Request as uRequest } from 'undici';
import {
  convertExpressQueryToURLSearchParams,
  convertExpressReqHeaderToHeadersInit,
  getExpressReqFullUrl,
} from './http-helpers';

export class HttpRequest implements types.HttpRequest {
  readonly query: URLSearchParams;
  readonly params: HttpRequestParams;

  #uReq: uRequest;
  #body?: Buffer | string;

  constructor(req: express.Request) {
    const url = getExpressReqFullUrl(req);
    this.#body = req.body;
    this.#uReq = new uRequest(url, {
      body: req.method === 'GET' ? undefined : req.body,
      method: req.method,
      headers: convertExpressReqHeaderToHeadersInit(req.headers),
    });

    this.query = convertExpressQueryToURLSearchParams(req.query);
    this.params = req.params;
  }

  get url(): string {
    return this.#uReq.url;
  }

  get method(): string {
    return this.#uReq.method;
  }

  get headers(): Headers {
    return this.#uReq.headers;
  }

  /**
   * In development, we may don't care this.
   * @deprecated This requres to call `extractHttpUserFromHeaders` in `@azure/functions` internally.
   */
  get user(): HttpRequestUser | null {
    logger.warn(`HttpRequest.user is not supported in development`);
    return null;
  }

  get body(): ReadableStream<unknown> | null {
    return this.#uReq.body;
  }

  get bodyUsed(): boolean {
    return this.#uReq.bodyUsed;
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return this.#uReq.arrayBuffer();
  }

  async blob(): Promise<Blob> {
    return this.#uReq.blob();
  }

  async formData(): Promise<FormData> {
    return this.#uReq.formData();
  }

  async json(): Promise<unknown> {
    return this.#uReq.json();
  }

  async text(): Promise<string> {
    return this.#uReq.text();
  }
}
