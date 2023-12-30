// Adapted from https://github.com/Azure/azure-functions-nodejs-library/blob/v4.x/src/http/HttpRequest.ts
import * as types from '@azure/functions';
import { HttpRequestParams, HttpRequestUser } from '@azure/functions';
import { Blob } from 'buffer';
import express from 'express';
import { IncomingHttpHeaders } from 'node:http';
import { logger } from '@nammatham/core';
import { ReadableStream } from 'stream/web';
import { FormData, Headers, Request as uRequest } from 'undici';
import { URLSearchParams } from 'url';

function convertExpressReqHeaderToHeadersInit(_headers: IncomingHttpHeaders): HeadersInit {
  const headers: Record<string, string | ReadonlyArray<string>> = {};

  for (const [key, value] of Object.entries(_headers)) {
    if (Array.isArray(value)) {
      headers[key] = value;
    } else if (value !== undefined) {
      headers[key] = value;
    }
  }

  return headers as HeadersInit;
}

function convertExpressQueryToURLSearchParams(query: express.Request['query']): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        params.append(key, String(v));
      }
    } else if (value !== undefined) {
      params.append(key, String(value));
    }
  }

  return params;
}

function getExpressReqFullUrl(req: express.Request): string {
  const protocol = req.protocol;
  const host = req.get('host');
  const path = req.originalUrl;

  return `${protocol}://${host}${path}`;
}

export class HttpRequest implements types.HttpRequest {
  readonly query: URLSearchParams;
  readonly params: HttpRequestParams;

  #cachedUser?: HttpRequestUser | null;
  #uReq: uRequest;
  #body?: Buffer | string;

  constructor(req: express.Request) {
    const url = getExpressReqFullUrl(req);
    this.#body = req.body;
    this.#uReq = new uRequest(url, {
      body: this.#body,
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
   * This requres to call `extractHttpUserFromHeaders` in `@azure/functions` internally.
   * In development, we may don't care this.
   */
  get user(): HttpRequestUser | null {
    logger.warn(`HttpRequest.user is not supported in development`);
    return null;
  }

  get body(): ReadableStream<any> | null {
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
