import { expect, test } from 'vitest';
import * as httpHelpers from './http-helpers';
import e, { Request as ExpressRequest } from 'express';

test('Test convertExpressQueryToURLSearchParams with string', () => {
  // Arrange
  const query = {
    a: '1',
    b: '2',
    c: '3',
  };

  // Act
  const result = httpHelpers.convertExpressQueryToURLSearchParams(query);

  // Assert
  expect(result).toBeInstanceOf(URLSearchParams);
  expect(result.get('a')).toBe('1');
  expect(result.get('b')).toBe('2');
  expect(result.get('c')).toBe('3');
  expect(result.toString()).toBe('a=1&b=2&c=3');
});

test('Test convertExpressQueryToURLSearchParams with array', () => {
  // Arrange
  const query = {
    a: ['1', '2', '3'],
    b: ['4', '5', '6'],
  };

  // Act
  const result = httpHelpers.convertExpressQueryToURLSearchParams(query);

  // Assert
  expect(result).toBeInstanceOf(URLSearchParams);
  expect(result.get('a')).toBe('1');
  expect(result.get('b')).toBe('4');
  expect(result.toString()).toBe('a=1&a=2&a=3&b=4&b=5&b=6');
});

test('Test convertExpressHeadersToHeaders with string', () => {
  // Arrange
  const headers = {
    a: '1',
    b: '2',
    c: '3',
  };

  // Act
  const result = httpHelpers.convertExpressReqHeaderToHeadersInit(headers);

  // Assert
  expect(result).toStrictEqual(headers);
});

test('Test convertExpressHeadersToHeaders with array', () => {
  // Arrange
  const headers = {
    a: ['1', '2', '3'],
    b: ['4', '5', '6'],
  };

  // Act
  const result = httpHelpers.convertExpressReqHeaderToHeadersInit(headers);

  // Assert
  expect(result).toStrictEqual(headers);
});

test('Test getExpressReqFullUrl', () => {
  // Arrange
  const req = {
    protocol: 'https',
    get: () => 'localhost',
    originalUrl: '/api/test',
  } as any as ExpressRequest;

  // Act
  const result = httpHelpers.getExpressReqFullUrl(req);

  // Assert
  expect(result).toBe('https://localhost/api/test');
});
