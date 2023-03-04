import { DecoratorTarget, HandlerDecorator } from './interfaces';
import { InvocationContext } from '@azure/functions';
import { FunctionName } from './design';


export function Get(...args: any[]): HandlerDecorator {
  return FunctionName(args);
}

export function Post(...args: any[]): HandlerDecorator {
  return FunctionName(args);
}


export function Req(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}

export function Res(...args: any[]): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}


export type AuthLevel = 'anonymous' | 'function' | 'admin';
export function AuthorizationLevel(authLevel: AuthLevel): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {};
}