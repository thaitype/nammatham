import { expect, test } from 'vitest';
import { AzureFunctionsAdapter } from './adapter';
import { AzureFunctionsTrigger } from './trigger';
import { NammathamApp } from '@nammatham/core';

test(`${AzureFunctionsAdapter.name} should be created correctly`, async () => {
  // Arrange
  const adapter = new AzureFunctionsAdapter();
  // Act
  const app = adapter.createApp();
  const func = adapter.createTrigger();

  // Assert
  expect(func).toBeInstanceOf(AzureFunctionsTrigger);
  expect(app).toBeInstanceOf(NammathamApp);
  expect(app.runtime === 'azure-functions').toBe(true);
  expect(app.isDevelopment).toBe(false);
});
