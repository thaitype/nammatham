import type { Equal, Expect } from '@type-challenges/utils';
import type { UnionToArray } from './union-to-array';

type Cases = [
  Expect<Equal<UnionToArray<undefined>, [undefined]>>,
  Expect<Equal<UnionToArray<any>, [any]>>,
  Expect<Equal<UnionToArray<'dog'>, ['dog']>>,
  Expect<Equal<UnionToArray<'dog' | 'cat'>, ['dog', 'cat']>>,
  Expect<Equal<UnionToArray<'cat' | 'dog'>, ['dog', 'cat']>>,
  // @ts-expect-error
  Expect<Equal<UnionToArray<'cat' | 'dog'>, ['cat', 'dog']>>,
  // @ts-expect-error
  Expect<Equal<UnionToArray<'dog' | 'cat'>, ['dog']>>
];
