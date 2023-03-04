import { DecoratorTarget, HandlerDecorator } from './interfaces';
import { InvocationContext } from '@azure/functions';

export function Controller() {
  return (target: NewableFunction): void => {
    console.log(target.name)
  };
}


export function FunctionName(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function BlobTrigger(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function BlobOutput(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function HttpTrigger(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function Logger(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function Context(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export type Log = {
  error: InvocationContext['error'];
  info: InvocationContext['info'];
};

