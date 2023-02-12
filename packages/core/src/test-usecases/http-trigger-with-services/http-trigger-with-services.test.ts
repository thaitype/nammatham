import test from 'ava';
import app from './fixtures/startup';
import { WithTypeUtilityFunction } from './fixtures/functions/with-type-utility.controller';
import { ContextFactory } from '../../test-helpers';
import { HttpRequest, HttpResponse } from '@azure/functions';
import { responseHelper, serviceData } from './fixtures/response-helper';

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

