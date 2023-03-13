import { DecoratorTarget, HandlerDecorator } from './interfaces';
import { InvocationContext } from '@azure/functions';

export function blobTrigger(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function blobOutput(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}
