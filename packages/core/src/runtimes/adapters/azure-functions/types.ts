import type { FunctionInput, FunctionOutput, InvocationContext } from '@azure/functions';
import { NammathamContext } from './nammatham-context';
import type { PromiseLike } from '../../types';

export type HandlerFunction<TTriggerType, TReturnType> = (
  triggerInput: TTriggerType,
  context: NammathamContext
) => PromiseLike<TReturnType>;

export type AnyHandler = (triggerInput: any, context: InvocationContext) => PromiseLike<any>;
export type InvokeFunctionOption = (option: {
  handler: AnyHandler;
  extraInputs: FunctionInput[];
  extraOutputs: FunctionOutput[];
}) => void;

export interface FunctionOption {
  extraInputs: FunctionInput[];
  extraOutputs: FunctionOutput[];
}

export interface AzureFunctionsEndpoint<TTriggerType, TReturnType> extends FunctionOption {
  type: 'azureFunctions';
  funcName: string;
  invokeHandler: (triggerInput: TTriggerType, context: InvocationContext) => PromiseLike<TReturnType>;
}