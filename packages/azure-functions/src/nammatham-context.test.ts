import { expect, test } from 'vitest';
import { NammathamContext } from './nammatham-context';
import { AzureFunctionsTrigger } from './trigger';
import { InvocationContext } from '@azure/functions';

test('NammathamContext should be created', () => {
  const trigger = new AzureFunctionsTrigger();
  const context = new InvocationContext();

  const result = new NammathamContext(context, trigger);

  expect(result).toBeInstanceOf(NammathamContext);
  expect(result.context).toStrictEqual(context);
  expect(result.trigger).toStrictEqual(trigger);
});
