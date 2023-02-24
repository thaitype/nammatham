// Ref: https://github.com/inversify/inversify-express-utils/blob/master/src/interfaces.ts

import { Context as AzureFuncContext, HttpRequest, HttpResponse } from '@azure/functions';
import { GetBindings, FunctionBinding, BaseFunctionBinding, HttpType, HttpTriggerType } from './bindings';
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
export type Context = TypedContext<any>;

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
