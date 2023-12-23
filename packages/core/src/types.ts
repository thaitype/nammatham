import type {
  CosmosDBFunctionOptions,
  EventGridFunctionOptions,
  EventHubFunctionOptions,
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

export type FunctionTriggerBase<TriggerType> = {
  name: string;
  type: TriggerType;
};

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
  | GenericFunctionTrigger;