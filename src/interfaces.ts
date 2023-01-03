// Ref: https://github.com/inversify/inversify-express-utils/blob/master/src/interfaces.ts

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
}

export interface ControllerMetadata {
  // middleware: Array<Middleware>;
  target: DecoratorTarget;
}
