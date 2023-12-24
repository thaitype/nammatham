import type { NammathamContext } from './nammatham-context';
import type { FunctionInput, FunctionOutput, InvocationContext } from '@azure/functions';

export type TriggerType =
  | 'http'
  | 'timer'
  | 'storageBlob'
  | 'storageQueue'
  | 'serviceBusQueue'
  | 'serviceBusTopic'
  | 'eventHub'
  | 'eventGrid'
  | 'cosmosDB';

export type PromiseLike<T> = T | Promise<T>;

export type HandlerFunction<TTriggerType, TReturnType> = (
  triggerInput: TTriggerType,
  context: NammathamContext
) => PromiseLike<TReturnType>;

export type FunctionAppOption<TTriggerOption = unknown> = {
  trigger: TTriggerOption;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
};

/**
 * Function Input & Output
 */

export type FunctionBinding<TType extends string = ''> = {
  type: TType;
} & Record<string, unknown>;

export type AnyHandler = (triggerInput: any, context: InvocationContext) => PromiseLike<any>;
export type InvokeFunctionOption = (option: {
  handler: AnyHandler;
  extraInputs: FunctionInput[];
  extraOutputs: FunctionOutput[];
}) => void;

export type StorageBlobInputOptions = {
  type: 'blob';
  connection: string;
  path: string;
} & Record<string, unknown>;

export type StorageBlobOutputOptions = {
  type: 'blob';
  connection: string;
  path: string;
} & Record<string, unknown>;

export interface NammathamFunctionEndpoint<TTriggerType, TReturnType> extends FunctionOption {
  funcName: string;
  invokeHandler: (triggerInput: TTriggerType, context: InvocationContext) => PromiseLike<TReturnType>;
}

export interface FunctionOption {
  extraInputs: FunctionInput[];
  extraOutputs: FunctionOutput[];
}
