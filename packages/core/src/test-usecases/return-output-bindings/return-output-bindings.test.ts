import test from 'ava';
import app from './fixtures/startup';

import { ContextFactory } from '../../test-helpers';
import { HttpRequest, HttpResponse } from '@azure/functions';
import { responseHelper, serviceData } from '../response-helper';
import { ReturnHttpResponseFunction } from './fixtures/functions/return-http-response.function';

test('Test ReturnHttpResponseFunction, data should return to azure function runtime', t => {
  const name = 'bobby';
  const httpRequest: Partial<HttpRequest> = {
    query: { name },
  };
  const httpResponse: Partial<HttpResponse> = {};
  const mockContext = ContextFactory.createBuilder().setRequest(httpRequest).setResponse(httpResponse).getContext();
  const response: HttpResponse = app.run({
    classTarget: ReturnHttpResponseFunction,
    azureFunctionParams: [mockContext, httpRequest, httpResponse],
  });

  t.is(response.body, responseHelper(name));
});


