import type { Equal, Expect } from '@type-challenges/utils';
import type { Zipper } from './zipper';

class Dog {}
class Cat {}

type Cases = [
  // Support primitive types
  Expect<Equal<Zipper<['name', 'age'], [string, number]>, Record<'name', string> & Record<'age', number>>>,
  // Support non-primitive types
  Expect<Equal<Zipper<['cat', 'dog'], [Cat, Dog]>, Record<'cat', Cat> & Record<'dog', Dog>>>,
  /**
   * the first argument must be `string | number | symbol`
   */
  // @ts-expect-error
  Zipper<[Cat, Dog], ['cat', 'dog']>,
];
