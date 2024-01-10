import type { FunctionInput, FunctionOutput, InvocationContext } from '@azure/functions';
import type { NammathamContext } from './nammatham-context';
import type { NammamthamEndpoint, PromiseLike } from '@nammatham/core';

export type HandlerFunction<TTriggerType, TReturnType> = (
  ctx: NammathamContext<TTriggerType>
) => PromiseLike<TReturnType>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyHandler = (triggerInput: unknown, context: InvocationContext) => PromiseLike<any>;

export type RegisterFunctionOption = (option: {
  handler: AnyHandler;
  extraInputs: FunctionInput[];
  extraOutputs: FunctionOutput[];
}) => void;

export interface FunctionOption {
  extraInputs: FunctionInput[];
  extraOutputs: FunctionOutput[];
}

export interface AzureFunctionsEndpoint<TTriggerType, TReturnType> extends NammamthamEndpoint, FunctionOption {
  type: 'azure-functions';
  invokeHandler: (triggerInput: TTriggerType, context: InvocationContext) => PromiseLike<TReturnType>;
  registerFunc: RegisterFunctionOption;
}
