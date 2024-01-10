import { expect, test } from 'vitest';
import { HttpRequest } from './HttpRequest';
import httpMocks from 'node-mocks-http';
import exp from 'constants';

test('Test HttpRequest', () => {
  // Arrange
  const req = httpMocks.createRequest({
    method: 'GET',
    protocol: 'https',
    // get: (key: string) => 'localhost',
    url: '/api/test',
    query: {
      a: '1',
      b: '2',
    },
    headers: {
      x: '1',
      y: '2',
    },
  });

  // Act
  const result = new HttpRequest(req);

  // Assert
  expect(result.method).toBe('GET');
  expect(result.url).toBe('https://undefined/api/test');
  expect(result.query.get('a')).toBe('1');
  expect(result.query.get('b')).toBe('2');
  expect(result.headers.get('x')).toBe('1');
  expect(result.headers.get('y')).toBe('2');
  expect(result.body).toBe(null);
  expect(result.params).toStrictEqual({});
  expect(result.user).toBe(null);
  expect(result.bodyUsed).toBe(false);
});
