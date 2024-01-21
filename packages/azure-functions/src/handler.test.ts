import { expect, test } from 'vitest';
import { AzureFunctionsHandler } from './handler';
import { InvocationContext } from '@azure/functions';
test(`${AzureFunctionsHandler.name}.handler should be invoked correctly`, async () => {
  // Arrange
  const handler = new AzureFunctionsHandler(
    'test',
    {
      extraInputs: [],
      extraOutputs: [],
      endpointOption: {
        type: 'http',
        route: 'test',
        methods: ['GET'],
      },
    },
    () => ''
  );

  // Act
  const endpoint = handler.handler(() => 'handlerResult');
  const result = endpoint.build().invokeHandler({}, new InvocationContext());

  // Assert
  expect(result).toBe('handlerResult');
  // NOTE: invokeHandler should test end-to-end
  expect(endpoint.build().invokeHandler).toBeInstanceOf(Function);
  // NOTE: registerFunc should test end-to-end
  expect(endpoint.registerFunc).toBeInstanceOf(Function);

  expect(handler).toBeInstanceOf(AzureFunctionsHandler);
  expect(endpoint.build().endpointOption?.type).toBe('http');
  expect(endpoint.build().endpointOption?.route).toBe('test');
  expect(endpoint.build().endpointOption?.methods).toEqual(['GET']);
  expect(endpoint.build().type).toBe('azure-functions');
  expect(endpoint.build().name).toBe('test');
});
