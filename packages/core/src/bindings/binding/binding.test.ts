import test from 'ava';
import * as binding from './';

test('Binding httpTrigger', t => {
  const expected = {
    name: 'test',
    type: 'httpTrigger',
    direction: 'in',
  };
  t.deepEqual(
    binding.httpTrigger({
      name: 'test',
    }),
    expected
  );
  t.deepEqual(
    binding.httpTrigger({
      name: 'test',
      type: 'not httpTrigger' as any,
      direction: 'not i2n' as any
    }),
    expected
  );
  t.deepEqual(
    binding.httpTrigger({
      name: 'test',
      type: 'httpTrigger',
      direction: 'in'
    }),
    expected
  );
});

test('Binding http', t => {
  const expected = {
    name: 'test',
    type: 'http',
    direction: 'out',
  };
  t.deepEqual(
    binding.http({
      name: 'test',
    }),
    expected
  );
  t.deepEqual(
    binding.http({
      name: 'test',
      type: 'not http' as any,
      direction: 'not out' as any
    }),
    expected
  );
  t.deepEqual(
    binding.http({
      name: 'test',
      type: 'http',
      direction: 'out'
    }),
    expected
  );
});

test('Binding timerTrigger', t => {
  const expected = {
    name: 'test',
    type: 'timerTrigger',
    direction: 'in',
    schedule: '*'
  };
  t.deepEqual(
    binding.timerTrigger({
      name: 'test',
      schedule: '*'
    }),
    expected
  );
  t.deepEqual(
    binding.timerTrigger({
      name: 'test',
      type: 'not timerTrigger' as any,
      direction: 'not in' as any,
      schedule: '*'
    }),
    expected
  );
  t.deepEqual(
    binding.timerTrigger({
      name: 'test',
      type: 'timerTrigger',
      direction: 'in',
      schedule: '*'
    }),
    expected
  );
});
