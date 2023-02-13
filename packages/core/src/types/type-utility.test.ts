import type { Equal, Expect } from '@type-challenges/utils';
import test from 'ava';
import type { PartialBy } from './type-utility';

interface Member {
  name: string;
  age: number;
}

type Cases = [
  Expect<
    Equal<
      // Act
      PartialBy<Member, 'age'>,
      // Expected
      Omit<Member, 'age'> & Partial<Pick<Member, 'age'>>
    >
  >,
  Expect<
    Equal<
      // Act
      PartialBy<Member, 'name' | 'age'>,
      // Expected
      Omit<Member, 'age' | 'name'> & Partial<Pick<Member, 'age' | 'name'>>
    >
  >
];

test('Test Type PartialBy', t => {
  const member: PartialBy<Member, 'age'> = {
    name: 'test',
  };
  const expected: PartialBy<Member, 'age'> = {
    name: 'test',
  };
  t.deepEqual(member, expected);
});
