import { ContextBindings } from '@azure/functions';
import { FunctionBinding } from '../interfaces/function-binding';
import { BindingType } from './binding';
import { Zipper, UnionToArray } from '../../types';

type GetTypeTuple<T extends  readonly FunctionBinding<unknown>[]> = T extends readonly [infer Head, ...infer Tail]
? Head extends FunctionBinding<unknown>
  ? Tail extends FunctionBinding<unknown>[]
    ? [BindingType<Head['type']>, ...GetTypeTuple<Tail>]
    : []
  : []
: [];

/**
 * `GetBindings`, extract type from `FunctionBinding<unknown>[]`
 *
 * Ref: @ts-ignore not included in .d.ts file when it's needed
 * https://github.com/microsoft/TypeScript/issues/38628#issuecomment-1378644305
 */
// TODO: make `UnionToArray<T[number]['name']>` can satisfy readonly Keys[]
export type GetBindings<T extends readonly FunctionBinding<unknown>[]> = ContextBindings &
  Zipper<
    /** @ts-ignore **/
    UnionToArray<T[number]['name']>,
    GetTypeTuple<T>
  >;
