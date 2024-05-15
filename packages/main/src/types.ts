import type { HandlerResponse } from 'hono/types';

export interface HttpTriggerOptions<TRoute extends string> {
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
