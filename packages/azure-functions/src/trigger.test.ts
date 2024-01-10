import { expect, test } from 'vitest';
import { AzureFunctionsTrigger } from './trigger';
import { AzureFunctionsHandler } from './handler';

test('Trigger HTTP GET', () => {
  const trigger = new AzureFunctionsTrigger();
  const result = trigger.httpGet('test');
  expect(result).toBeInstanceOf(AzureFunctionsHandler);
});

test('Trigger HTTP POST', () => {
  const trigger = new AzureFunctionsTrigger();
  const result = trigger.httpPost('test');
  expect(result).toBeInstanceOf(AzureFunctionsHandler);
});

test('Trigger HTTP PUT', () => {
  const trigger = new AzureFunctionsTrigger();
  const result = trigger.httpPut('test');
  expect(result).toBeInstanceOf(AzureFunctionsHandler);
});

test('Trigger HTTP DELETE', () => {
  const trigger = new AzureFunctionsTrigger();
  const result = trigger.httpDelete('test');
  expect(result).toBeInstanceOf(AzureFunctionsHandler);
});

test('Trigger HTTP', () => {
  const trigger = new AzureFunctionsTrigger();
  const result = trigger.http('test');
  expect(result).toBeInstanceOf(AzureFunctionsHandler);
});

