import type { HandlerResponse } from 'hono/types';

export interface AzureFunctionBindings extends Record<string, unknown> {
  type: string;
  direction: 'in' | 'out';
  name: string;
}

export interface AzureFunctionMetadata extends Record<string, unknown> {
  bindings: AzureFunctionBindings[];
}

export interface NammathamFunction {
  name: string;
  metadata?: AzureFunctionMetadata;
}

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpTriggerOptions<TRoute extends string = string> {
  name?: string;
  methods: HttpMethods[];
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
  get<T extends string>(route: T): unknown;
  post<T extends string>(route: T): unknown;
  http(options: HttpTriggerOptions): unknown;
}
