import type {
  CosmosDBFunctionOptions,
  EventGridFunctionOptions,
  EventHubFunctionOptions,
  FunctionOptions,
  GenericFunctionOptions,
  HttpFunctionOptions,
  ServiceBusQueueFunctionOptions,
  ServiceBusTopicFunctionOptions,
  StorageBlobFunctionOptions,
  StorageQueueFunctionOptions,
  TimerFunctionOptions,
  WarmupFunctionOptions,
} from '@azure/functions';
export type MaybePromise<T> = Promise<T> | T;

export interface FunctionTriggerBase<TriggerType> {
  type: TriggerType;
}

interface CustomFunctionOptions extends Partial<FunctionOptions>, Record<string, unknown> {
  /**
   * When you want to use a custom function register from `@azure/functions` directly, you can also pass it here,
   * 
   * @example
   * 
   * When you want to call `app.http` directly, you can use it like this:
   * 
   * ```typescript
   * import { createFunction } from 'nammatham';
   * import { app } from '@azure/functions';
   * 
   * export async function hello(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
      context.log(`Http function processed request for url "${request.url}"`);
      return { body: `Hello` };
     }
   * 
     export default createFunction('hello', {
       type: 'custom',
       handler: hello,
       methods: ['GET', 'POST'],
       authLevel: 'anonymous',
       customRegisterFunction: app.http,
    });
   * ```
   */
  customRegisterFunction?: (name: string, optionsOrHandler: any) => void;
}

export type HttpFunctionTrigger = FunctionTriggerBase<'http'> & HttpFunctionOptions;
export type TimerFunctionTrigger = FunctionTriggerBase<'timer'> & TimerFunctionOptions;
export type StorageBlobFunctionTrigger = FunctionTriggerBase<'storageBlob'> & StorageBlobFunctionOptions;
export type StorageQueueFunctionTrigger = FunctionTriggerBase<'storageQueue'> & StorageQueueFunctionOptions;
export type ServiceBusQueueFunctionTrigger = FunctionTriggerBase<'serviceBusQueue'> & ServiceBusQueueFunctionOptions;
export type ServiceBusTopicFunctionTrigger = FunctionTriggerBase<'serviceBusTopic'> & ServiceBusTopicFunctionOptions;
export type EventHubFunctionTrigger = FunctionTriggerBase<'eventHub'> & EventHubFunctionOptions;
export type EventGridFunctionTrigger = FunctionTriggerBase<'eventGrid'> & EventGridFunctionOptions;
export type CosmosDBFunctionTrigger = FunctionTriggerBase<'cosmosDB'> & CosmosDBFunctionOptions;
export type WarmupFunctionTrigger = FunctionTriggerBase<'warmup'> & WarmupFunctionOptions;
export type GenericFunctionTrigger = FunctionTriggerBase<'generic'> & GenericFunctionOptions;
export type CustomFunctionTrigger = FunctionTriggerBase<'custom'> & CustomFunctionOptions;

export type FunctionTrigger =
  | HttpFunctionTrigger
  | TimerFunctionTrigger
  | StorageBlobFunctionTrigger
  | StorageQueueFunctionTrigger
  | ServiceBusQueueFunctionTrigger
  | ServiceBusTopicFunctionTrigger
  | EventHubFunctionTrigger
  | EventGridFunctionTrigger
  | CosmosDBFunctionTrigger
  | WarmupFunctionTrigger
  | GenericFunctionTrigger
  | CustomFunctionTrigger;
