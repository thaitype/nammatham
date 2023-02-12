import test from 'ava';
import app from './fixtures/startup';
import { WithTypeUtilityFunction } from './fixtures/functions/with-type-utility.function';
import { ContextFactory } from '../../test-helpers';
import { HttpRequest, HttpResponse } from '@azure/functions';
import { responseHelper, serviceData } from './fixtures/response-helper';
import { HttpTriggerHelperFunction } from './fixtures/functions/http-trigger-helper.function';

test('Test WithTypeUtilityFunction, Passing query param and check the response is gotten', t => {
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

test('Test HttpTriggerHelperFunction, Passing query param and check the response is gotten', t => {
  const name = 'bobby';
  const httpRequest: Partial<HttpRequest> = {
    query: { name },
  };
  const httpResponse: Partial<HttpResponse> = {};
  const mockContext = ContextFactory.createBuilder().setRequest(httpRequest).setResponse(httpResponse).getContext();
  app.run({
    classTarget: HttpTriggerHelperFunction,
    azureFunctionParams: [mockContext, httpRequest, httpResponse],
  });

  t.is(mockContext.res?.body, responseHelper(name, serviceData));
});


