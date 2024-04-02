import { expect, test } from 'vitest';
import helloFunc from '../src/functions/hello';
import { HttpRequest, InvocationContext } from '@azure/functions';
import { NammathamContext } from 'nammatham';

test('helloFunc', async () => {
  const handler = helloFunc.getHandler();
  const nammathamConext = new NammathamContext(new InvocationContext(), new HttpRequest({
    method: 'GET',
    url: 'http://localhost:3000/api/hello-world',
    query: {
      name: 'world',
    },
  }))
  const result = await handler(nammathamConext);

  expect(result).toEqual({
    jsonBody: {
      data: {
        name: 'world',
        message: 'Hello, world!',
      },
    },
  });
});
