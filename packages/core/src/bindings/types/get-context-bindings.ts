import { ContextBindings } from '@azure/functions';
import { FunctionBinding } from '../interfaces/function-binding';
import { BindingType } from './binding';
import { Zipper } from '../../types';
import { DirectionType } from '../../main';

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

type FilterBindingsDirection<
  T extends readonly FunctionBinding<unknown>[],
  Direction extends DirectionType
> = T extends readonly [infer Head, ...infer Tail]
  ? Head extends FunctionBinding<unknown>
    ? Tail extends FunctionBinding<unknown>[]
      ? Head['direction'] extends Direction
        ? [Head, ...FilterBindingsDirection<Tail, Direction>]
        : [...FilterBindingsDirection<Tail, Direction>]
      : []
    : []
  : [];

/**
 * `GetBindings`, extract type from `FunctionBinding<unknown>[]`
 */
export type GetBindings<T extends readonly FunctionBinding<unknown>[]> = ContextBindings &
  Zipper<GetNameTuple<T>, GetTypeTuple<T>>;

export type GetOnlyOutputBindings<T extends readonly FunctionBinding<unknown>[]> = GetBindings<
  FilterBindingsDirection<T, 'out'>
>;
export type GetOnlyInputBindings<T extends readonly FunctionBinding<unknown>[]> = GetBindings<
  FilterBindingsDirection<T, 'in'>
>;
export type GetOnlyInputOutputBindings<T extends readonly FunctionBinding<unknown>[]> = GetBindings<
  FilterBindingsDirection<T, 'inout'>
>;

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


type GetBindingOnlyReturnName<T extends readonly FunctionBinding<unknown>[]> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? Head extends FunctionBinding<unknown>
    ? Tail extends FunctionBinding<unknown>[]
      ? Head['name'] extends '$return'
        ? [Head]
        : [...GetBindingOnlyReturnName<Tail>]
      : []
    : []
  : [];

type GetFirstArray<T extends any[]> = T['length'] extends 1 ? T[0] : undefined;

/**
 * Get Correct Type from Return Functions,
 *
 * If set the `name` property in function.json to `$return`, it will return only single output.
 * Otherwise, it will return multiple output.
 *
 * Set the `name` property in function.json to `$return`. If there are multiple output bindings, use the return value for only one of them.
 * Ref: https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-return-value?tabs=javascript
 */

export type GetOnlyReturnBindings<T extends readonly FunctionBinding<unknown>[]> = GetFirstArray<
  GetBindingOnlyReturnName<T>
> extends infer Item
  ? Item extends undefined
    ? GetOnlyOutputBindings<T>
    : Item extends FunctionBinding<unknown>
    ? BindingType<Item['type']>
    : never
  : never;
