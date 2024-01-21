import { expect, test } from 'vitest';
import helloFunc from '../src/functions/hello';
import { HttpRequest, InvocationContext } from '@azure/functions';

test('helloFunc', async () => {
  const handler = helloFunc.getHandler();
  const result = await handler({
    context: new InvocationContext(),
    trigger: new HttpRequest({
      method: 'GET',
      url: 'http://localhost:3000/api/hello-world',
      query: {
        name: 'world',
      },
    }),
  });

  expect(result).toEqual({
    jsonBody: {
      data: {
        name: 'world',
        message: 'Hello, world!',
      },
    },
  });
});
