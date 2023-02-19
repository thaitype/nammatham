import test from 'ava';
import app from './fixtures/startup';

import { ContextFactory } from '../../test-helpers';
import { HttpRequest, HttpResponse } from '@azure/functions';
import { responseHelper, serviceData } from '../response-helper';
import { AllBindingsFunction } from './fixtures/functions/all-bindings.function';

test('Test AllBindingsFunction, data should return to azure function runtime', t => {
  const name = 'bobby';
  const httpRequest: Partial<HttpRequest> = {
    query: { name },
  };
  const httpResponse: Partial<HttpResponse> = {};
  const mockContext = ContextFactory.createBuilder().setRequest(httpRequest).setResponse(httpResponse).getContext();
  app.run({
    classTarget: AllBindingsFunction,
    azureFunctionParams: [mockContext, httpRequest, httpResponse],
  });

  t.is(mockContext.res?.body, responseHelper(name));
});


