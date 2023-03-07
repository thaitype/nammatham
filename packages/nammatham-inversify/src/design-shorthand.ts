import { DecoratorTarget, HandlerDecorator } from './interfaces';
import { InvocationContext } from '@azure/functions';
import { functionName } from './design';


export function httpGet(...args: any[]): HandlerDecorator {
  return functionName(args);
}

export function httpPost(...args: any[]): HandlerDecorator {
  return functionName(args);
}


export function req(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function res(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}


export type AuthLevel = 'anonymous' | 'function' | 'admin';
export function authorizationLevel(authLevel: AuthLevel): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}