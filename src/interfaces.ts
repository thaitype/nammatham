// Ref: https://github.com/inversify/inversify-express-utils/blob/master/src/interfaces.ts

import { FunctionBinding } from "./bindings";

export type HandlerDecorator = (
  target: DecoratorTarget,
  key: string,
  value: unknown
) => void;

export type DecoratorTarget<T = unknown> =
  | ConstructorFunction<T>
  | Prototype<T>;

interface ConstructorFunction<T = Record<string, unknown>> {
  new (...args: Array<unknown>): T;
  prototype: Prototype<T>;
}

type Prototype<T> = {
  [P in keyof T]: T[P] extends NewableFunction ? T[P] : T[P] | undefined;
} & {
  constructor: NewableFunction;
};

//

export interface AzureFunctionMethodMetadata extends ControllerMetadata {
  key: string;
  name: string;
  binding: FunctionBinding[];
}

export interface ControllerMetadata {
  // middleware: Array<Middleware>;
  target: DecoratorTarget;
}


export type ControllerHandler = (...params: Array<unknown>) => unknown;
export type Controller = Record<string, ControllerHandler>;

export const NO_CONTROLLERS_FOUND = 'No controllers' +
  'have been found! Please ensure that you have register' +
  'at least one Controller.';