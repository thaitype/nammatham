// Ref: https://github.com/inversify/inversify-express-utils/blob/master/src/interfaces.ts

import { Context as AzureFuncContext, HttpRequest, HttpResponse, RetryContext } from '@azure/functions';
import {
  GetBindings,
  FunctionBinding,
  BaseFunctionBinding,
  HttpType,
  HttpTriggerType,
  TypedContextBindingData,
} from './bindings';
import { NotAny } from '@type-challenges/utils';

export type GetReturnType<ReturnType, FallbackReturnType> = FallbackReturnType extends undefined
  ? ReturnType
  : FallbackReturnType;
export type IsBindingWith<
  T extends readonly FunctionBinding<unknown>[],
  Type,
  ReturnType,
  FallbackReturnType = undefined
> = NotAny<T> extends true
  ? Type extends T[number]['type']
    ? ReturnType
    : GetReturnType<ReturnType, FallbackReturnType> | undefined
  : GetReturnType<ReturnType, FallbackReturnType> | undefined;

type OriginalContextRes = NonNullable<AzureFuncContext['res']>;

/**
 * Azure Function Context for `TypeContext<any>` (Ignore Type)
 * 
 * The context object can be used for writing logs, reading data from bindings, setting outputs and using
 * the context.done callback when your exported function is synchronous. A context object is passed
 * to your function from the Azure Functions runtime on function invocation.
 * 
 * @example
   ```
   import { Context } from 'nammatham';

   function processContext(context: Context){
    const { req } = context.bindings;
    //       ^-- This will be `any` 
   }
   ```
 */
export type Context = InvocationContext<any>;
/**
 * @remark Mapping from v3.x to v4.x with `Context.bindingData`
 */
export type TriggerMetadata<T extends readonly FunctionBinding<unknown>[]> = TypedContextBindingData<T>;

/**
 * Related with input except trigger type e.g. httpTrigger
 */
export type InvocationContextExtraInputs = null | undefined;
export type InvocationContextExtraOutputs = null | undefined;

/**
 * Wrapping `Context` from v3.x with `InvocationContext` from v4.x
 *
 * Implement the similar interface from v4.x, preparing to migrate to v4.x when v4.x is GA
 */
export interface InvocationContext<T extends readonly FunctionBinding<unknown>[] = any> extends TypedContext<T> {
  /**
   * A unique guid specific to this invocation
   */
  invocationId: string;

  /**
   * The name of the function that is being invoked
   */
  functionName: string;

  /**
   * An object used to get secondary inputs
   */
  extraInputs: InvocationContextExtraInputs;

  /**
   * An object used to set secondary outputs
   */
  extraOutputs: InvocationContextExtraOutputs;

  /**
   * The recommended way to log debug data (level 1) during invocation.
   * Similar to Node.js's `console.debug`, but has integration with Azure features like application insights
   * @remark Map with `Log.verbose`
   */
  debug(...args: any[]): void;

  /**
   * The recommended way to log information data (level 2) during invocation.
   * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
   */
  info(...args: any[]): void;

  /**
   * The recommended way to log warning data (level 3) during invocation.
   * Similar to Node.js's `console.warn`, but has integration with Azure features like application insights
   */
  warn(...args: any[]): void;

  /**
   * The recommended way to log error data (level 4) during invocation.
   * Similar to Node.js's `console.error`, but has integration with Azure features like application insights
   */
  error(...args: any[]): void;

  /**
   * The retry context of the current function execution if the retry policy is defined
   */
  retryContext?: RetryContext;

  /**
   * Metadata about the trigger or undefined if the metadata is already represented elsewhere
   * For example, this will be undefined for http and timer triggers because you can find that information on the request & timer object instead
   *
   * @remark Mapping from v3.x to v4.x with `Context.bindingData`
   */
  // TODO: Require to proof is it same data or not.
  triggerMetadata?: TriggerMetadata<T>;
}
/**
 * Wrapping Azure Function Context with Type
 * 
 * The context object can be used for writing logs, reading data from bindings, setting outputs and using
 * the context.done callback when your exported function is synchronous. A context object is passed
 * to your function from the Azure Functions runtime on function invocation.
 * 
 * @example
   ```
   import { TypedContext, binding } from 'nammatham';
   const bindings = [
     binding.httpTrigger({ name: 'req' as const }),
     binding.http({ name: 'res' as const }),
   ] as const;

   function processContext(context: TypedContext<typeof bindings>){
    const { req } = context.bindings;
    //       ^-- This will be `HttpRequest` 
   }
   ```
 */
export interface TypedContext<T extends readonly FunctionBinding<unknown>[]>
  extends Omit<AzureFuncContext, 'req' | 'bindingDefinitions'> {
  /**
   * Add prop from the base interface, based on FunctionBinding
   */
  res: IsBindingWith<T, HttpType, HttpResponse, OriginalContextRes>;

  /**
   * Override prop req from the base interface, based on FunctionBinding
   */
  req: IsBindingWith<T, HttpTriggerType, HttpRequest>;

  /**
   * Provide more specific type from FunctionBinding
   */
  bindings: GetBindings<T>;

  /**
   * Provide more specific type from FunctionBinding
   */
  bindingDefinitions: T;
  /**
   * Trigger metadata and function invocation data.
   */
  bindingData: TypedContextBindingData<T>;
}

export type HandlerDecorator = (target: DecoratorTarget, key: string, value: unknown) => void;

export type DecoratorTarget<T = unknown> = ConstructorFunction<T> | Prototype<T>;

interface ConstructorFunction<T = Record<string, unknown>> {
  new (...args: Array<unknown>): T;
  prototype: Prototype<T>;
}

type Prototype<T> = {
  [P in keyof T]: T[P] extends NewableFunction ? T[P] : T[P] | undefined;
} & {
  constructor: NewableFunction;
};

export interface ControllerMetadata<T = null> {
  // middleware: Array<Middleware>;
  name: string;
  binding: Array<BaseFunctionBinding<T, string>>;
  target: DecoratorTarget;
}

export type ControllerHandler = (...params: Array<unknown>) => unknown;
