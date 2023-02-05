import { Context, HttpResponse } from '@azure/functions';
import { GetContextBindings } from '../types';
import { FunctionBinding } from './function-binding';

export interface TypedContext<T extends readonly FunctionBinding<unknown>[]> extends Context {
    res?: HttpResponse;
    
    bindings: GetContextBindings<T>; /** Provide more specific type from FunctionBinding  */
}
