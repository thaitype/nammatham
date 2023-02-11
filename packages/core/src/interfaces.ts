// Ref: https://github.com/inversify/inversify-express-utils/blob/master/src/interfaces.ts

import { Context, HttpRequest, HttpResponse } from '@azure/functions';
import {
  GetContextBindings,
  FunctionBinding,
  BaseFunctionBinding,
  HttpTriggerResponseType,
  HttpTriggerRequestType,
} from './bindings';

export type GetReturnType<ReturnType, FallbackReturnType> = FallbackReturnType extends undefined
  ? ReturnType
  : FallbackReturnType;
export type IsBindingWith<
  T extends readonly FunctionBinding<unknown>[],
  Type,
  ReturnType,
  FallbackReturnType = undefined
> = Type extends T[number]['type'] ? ReturnType : GetReturnType<ReturnType, FallbackReturnType> | undefined;

type OriginalContextRes = NonNullable<Context['res']>;

export interface TypedContext<T extends readonly FunctionBinding<unknown>[]> extends Omit<Context, 'req'> {
  /**
   * Add prop from the base interface, based on FunctionBinding
   */
  res: IsBindingWith<T, HttpTriggerResponseType, HttpResponse, OriginalContextRes>;

  /**
   * Override prop req from the base interface, based on FunctionBinding
   */
  req: IsBindingWith<T, HttpTriggerRequestType, HttpRequest>;

  /**
   * Provide more specific type from FunctionBinding
   */
  bindings: GetContextBindings<T>;
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
export type Controller = Record<string, ControllerHandler>;

export const NO_CONTROLLERS_FOUND =
  'No controllers' + 'have been found! Please ensure that you have register' + 'at least one Controller.';
