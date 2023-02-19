import { ContextBindings } from '@azure/functions';
import { FunctionBinding } from '../interfaces/function-binding';
import { BindingType } from './binding';
import { Zipper } from '../../types';

type GetTypeTuple<T extends readonly FunctionBinding<unknown>[]> = T extends readonly [infer Head, ...infer Tail]
  ? Head extends FunctionBinding<unknown>
    ? Tail extends FunctionBinding<unknown>[]
      ? [BindingType<Head['type']>, ...GetTypeTuple<Tail>]
      : []
    : []
  : [];

type GetNameTuple<T extends readonly FunctionBinding<unknown>[]> = T extends readonly [infer Head, ...infer Tail]
  ? Head extends FunctionBinding<unknown>
    ? Tail extends FunctionBinding<unknown>[]
      ? [Head['name'], ...GetNameTuple<Tail>]
      : []
    : []
  : [];

/**
 * `GetBindings`, extract type from `FunctionBinding<unknown>[]`
 */
export type GetBindings<T extends readonly FunctionBinding<unknown>[]> = ContextBindings &
  Zipper<GetNameTuple<T>, GetTypeTuple<T>>;
