import test from 'ava';
import execa from 'execa';
import path from 'path';
import fs from 'node:fs';
import { builder } from './fixtures/src/startup';

const startupPath = 'src/startup.ts';
const workingDirectory = 'tests/boostrap-phase/fixtures';

const execaOption: execa.Options = {
  cwd: workingDirectory,
  env: {
    nammatham_env: 'build',
  },
};

test.beforeEach(async t => {
  await execa.command(`npx ts-node ${startupPath}`, execaOption);
});

test('After run boostrap phase, the output script should pass typecheck', async t => {
  await t.notThrowsAsync(execa.command(`tsc --noEmit`, execaOption));
});

test.afterEach(async t => {
  t.not(builder.getFunctionNames().length, 0);
  for (const functionName of builder.getFunctionNames()) {
    fs.rmSync(path.join(workingDirectory, functionName), { recursive: true, force: true });
  }
});
