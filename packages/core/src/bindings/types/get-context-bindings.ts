import { ContextBindings } from '@azure/functions';
import { FunctionBinding } from '../interfaces/function-binding';
import { AllBindingTypes, Binding } from './binding';
import { Zipper, UnionToArray } from '../../types';

type GetBindingObjectArray<T extends AllBindingTypes[]> = T extends [infer Head, ...infer Tail]
  ? Head extends AllBindingTypes
    ? Tail extends AllBindingTypes[]
      ? [Binding<Head>, ...GetBindingObjectArray<Tail>]
      : []
    : []
  : [];

/**
 * GetBindingContext
 * TODO: make `UnionToArray<T[number]['name']>` can satisfy readonly Keys[]
 * Ref: @ts-ignore not included in .d.ts file when it's needed  
 * https://github.com/microsoft/TypeScript/issues/38628#issuecomment-1378644305
 */

export type GetContextBindings<T extends readonly FunctionBinding<unknown>[]> =
  ContextBindings &
    Zipper<
      /** @ts-ignore **/ 
      UnionToArray<T[number]['name']>,
      GetBindingObjectArray<
        /** @ts-ignore **/
        UnionToArray<T[number]['type']>
      >
    >;

