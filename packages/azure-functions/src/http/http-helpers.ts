import { IncomingHttpHeaders } from 'node:http';
import express from 'express';

export function convertExpressReqHeaderToHeadersInit(_headers: IncomingHttpHeaders): HeadersInit {
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

export function convertExpressQueryToURLSearchParams(query: express.Request['query']): URLSearchParams {
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

export function getExpressReqFullUrl(req: express.Request): string {
  const protocol = req.protocol;
  const host = req.get('host');
  const path = req.originalUrl;

  return `${protocol}://${host}${path}`;
}
