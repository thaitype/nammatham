/**
 * Ref:
 * - https://catchts.com/tuples
 * - https://stackoverflow.com/questions/67021405/ts-types-convert-arrays-of-keys-and-array-of-values-to-object
 */
// https://catchts.com/tuples

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
export type Zipper<T extends ReadonlyArray<Keys>, U extends ReadonlyArray<any>> = CompareLength<T, U> extends true
  ? Zip<T, U>
  : never;
