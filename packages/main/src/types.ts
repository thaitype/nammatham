import type { HandlerResponse } from 'hono/types';

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpTriggerOptions<TRoute extends string = string> {
  method: HttpMethods[];
  authLevel?: 'anonymous' | 'function' | 'admin';
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  route?: TRoute;
}

export interface InvocationContext {
  invocationId: string;
  inputs: Record<string, any>;
  json: (data: any) => HandlerResponse<any>;
  log: (message: string) => void;
  triggerMetadata?: TriggerMetadata;
}
export type TriggerMetadata = Record<string, unknown>;

export interface NammathamTrigger {
  http(options: HttpTriggerOptions): unknown;
}
