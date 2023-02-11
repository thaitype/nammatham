import test from 'ava';
import { extractRelativeWorkingDirectory, removeExtension } from './utils';

test('extractRelativeWorkingDirectory', t => {
  t.is(
    extractRelativeWorkingDirectory('/home/nammatham/examples/crud', '/home/nammatham/examples/crud/src/main.ts'),
    '/src'
  );
});

test('removeExtension', t => {
  t.is(removeExtension('main.ts'), 'main');
});
