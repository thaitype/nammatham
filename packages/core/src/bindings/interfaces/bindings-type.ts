import { ContextBindings, HttpRequest, HttpResponse } from '@azure/functions';
import type { UnionToIntersection } from 'type-fest';
import { FunctionBinding } from './function-binding';
import { AllBindingTypes, Binding } from './types';

// ----- START ---
// https://catchts.com/tuples
// https://stackoverflow.com/questions/67021405/ts-types-convert-arrays-of-keys-and-array-of-values-to-object
type Length<T extends ReadonlyArray<any>> = T extends { length: infer L } ? L : never;

type CompareLength<X extends ReadonlyArray<any>, Y extends ReadonlyArray<any>> = Length<X> extends Length<Y>
  ? true
  : false;

type Keys = string | number | symbol;
type Mapper<T, U> = T extends Keys ? Record<T, U> : never;
type AllowedKeys<T> = T extends readonly Keys[] ? T : never;

/**
 * Recursive iteration through two arrays
 */
type Zip<
  T extends ReadonlyArray<Keys>,
  U extends ReadonlyArray<any>,
  Result extends Record<string, any> = {}
> = CompareLength<T, U> extends true
  ? T extends []
    ? Result
    : T extends [infer HeadT1]
    ? U extends [infer HeadU1]
      ? Result & Mapper<HeadT1, HeadU1>
      : never
    : T extends [infer HeadT2, ...infer TailT2]
    ? U extends [infer HeadU2, ...infer TailU2]
      ? Zip<AllowedKeys<TailT2>, TailU2, Result & Mapper<HeadT2, HeadU2>>
      : never
    : never
  : never;

/**
 * Apply Zip only if arrays length is equal, otherwise return never
 */
type Zipper<T extends ReadonlyArray<Keys>, U extends ReadonlyArray<any>> = CompareLength<T, U> extends true
  ? Zip<T, U>
  : never;

// ------------- CLOSE ------

// https://catchts.com/union-array
// Converts union to overloaded function
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
//   k: infer I
// ) => void
//   ? I
//   : never;

type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// Finally me)
type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A];
// https://catchts.com/union-array

// const bindings = [
//   {
//     name: 'req',
//     type: 'httpTrigger',
//     direction: 'in',
//     // route: '/home',
//   } as HttpTriggerRequestBinding<'req'>,
//   {
//     name: 'res',
//     direction: 'out',
//     type: 'http',
//   } as HttpTriggerResponseBinding<'res'>
// ] as const;

// type AllBindingTypes = FunctionBinding<unknown>['type']; 

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

// const myContextBindings: GetBindingContext<typeof bindings> = {
//   // Mock type
//   req: {} as HttpRequest,
//   res: {} as HttpResponse,
// };
