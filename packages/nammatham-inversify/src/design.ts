import { DecoratorTarget, HandlerDecorator } from './interfaces';
import { InvocationContext } from '@azure/functions';

// export function controller() {
//   return (target: NewableFunction): void => {
//     console.log(target.name)
//   };
// }


// export function functionName(...args: any[]): HandlerDecorator {
//   return (target: DecoratorTarget, key: string): void => {};
// }

export function blobTrigger(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function blobOutput(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function httpTrigger(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function logger(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function context(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export type Logger = {
  error: InvocationContext['error'];
  info: InvocationContext['info'];
};

