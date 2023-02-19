import type { UnionToIntersection } from 'type-fest';

/**
 * Ref: https://catchts.com/union-array
 */

/**
 * Converts union to overloaded function
 */
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

/**
 * @deprecated
 * Previously, `UnionToArray` used for `Zipper` type.
 * Consider to remove from the code.
 * 
 * Ref: @ts-ignore not included in .d.ts file when it's needed
 * https://github.com/microsoft/TypeScript/issues/38628#issuecomment-1378644305
 * TODO: make `UnionToArray<T[number]['name']>` can satisfy readonly Keys[]
 */
export type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A];
