import { DecoratorTarget, HandlerDecorator } from './interfaces';
import { InvocationContext } from '@azure/functions';
import { FunctionName } from './decorators';

export function httpGet(...args: any[]): HandlerDecorator {
  return FunctionName('');
}

export function httpPost(...args: any[]): HandlerDecorator {
  return FunctionName('');
}

export function req(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export type AuthLevel = 'anonymous' | 'function' | 'admin';
export function authorizationLevel(authLevel: AuthLevel): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}
