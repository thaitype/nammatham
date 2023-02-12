import test from 'ava';
import execa from 'execa';
import path from 'path';
import fs from 'node:fs';
import app, { builder } from './src/startup';
import { WithTypeUtilityFunction } from './src/functions/with-type-utility.controller';
import { ContextFactory } from '../../../src/test-helpers';
import { HttpRequest, HttpResponse } from '@azure/functions';
import { responseHelper, serviceData } from './src/response-helper';

const startupPath = 'src/startup.ts';
const workingDirectory = 'tests/fixture/http-trigger-with-services';

const execaOption: execa.Options = {
  cwd: workingDirectory,
  env: {
    nammatham_env: 'build',
  },
};

test.beforeEach(async t => {
  await execa.command(`npx ts-node ${startupPath}`, execaOption);
});

test('Mock Test', t => {
  t.is('a','a');
});

test.afterEach(async t => {
  t.not(builder.getFunctionNames().length, 0);
  for (const functionName of builder.getFunctionNames()) {
    fs.rmSync(path.join(workingDirectory, functionName), { recursive: true, force: true });
  }
});
