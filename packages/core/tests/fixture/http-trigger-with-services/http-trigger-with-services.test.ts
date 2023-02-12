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

test('Passing query param and check the response is gotten', t => {
  const name = 'bobby';
  const httpRequest: Partial<HttpRequest> = {
    query: { name },
  };
  const httpResponse: Partial<HttpResponse> = {};
  const mockContext = ContextFactory.createBuilder().setRequest(httpRequest).setResponse(httpResponse).getContext();
  app.run({
    classTarget: WithTypeUtilityFunction,
    azureFunctionParams: [mockContext, httpRequest, httpResponse],
  });

  t.is(mockContext.res?.body, responseHelper(name, serviceData));
});

test.afterEach(async t => {
  t.not(builder.getFunctionNames().length, 0);
  for (const functionName of builder.getFunctionNames()) {
    fs.rmSync(path.join(workingDirectory, functionName), { recursive: true, force: true });
  }
});
