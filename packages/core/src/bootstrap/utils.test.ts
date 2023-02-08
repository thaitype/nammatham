import test from 'ava';
import { extractRelativeWorkingDirectory } from './utils';

test('extractRelativeWorkingDirectory', t => {
  t.is(
    extractRelativeWorkingDirectory('/home/nammatham/examples/crud', '/home/nammatham/examples/crud/src/main.ts'),
    '/src'
  );
});
