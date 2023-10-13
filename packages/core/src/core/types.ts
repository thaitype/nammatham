import { getExtraInputGetterFunc, getExtraOutputSetterFunc } from './helpers';
import type { NammathamContext } from './nammatham-context';
import type { FunctionInput, FunctionOutput, InvocationContext } from '@azure/functions';

export type MapTypeToSetterParams<TType> = TType extends 'blob' ? unknown : unknown;

export type ConvertOutput<T extends OutputCollection> = {
  [K in keyof T]: typeof getExtraOutputSetterFunc<MapTypeToSetterParams<T[K]['type']>> extends (
    context: InvocationContext,
    name: string
  ) => infer R
    ? R
    : never;
};

export type ConvertInput<T extends InputCollection> = {
  [K in keyof T]: typeof getExtraInputGetterFunc<MapTypeToSetterParams<T[K]['type']>> extends (
    context: InvocationContext,
    name: string
  ) => infer R
    ? R
    : never;
};

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

export type HandlerFunction<
  TTriggerType,
  TReturnType,
  TInput extends InputCollection,
  TOutput extends OutputCollection
> = (triggerInput: TTriggerType, context: NammathamContext<TInput, TOutput>) => PromiseLike<TReturnType>;

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

export type InputCollection = Record<string, FunctionInput>;
export type OutputCollection = Record<string, FunctionOutput>;

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
