import { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { createFunction } from 'nammatham';

export async function hello(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const name = request.query.get('name') || (await request.text()) || 'world';

  return { body: `Hello, ${name}!` };
}

export default createFunction({
  name: 'hello',
  type: 'http',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: hello,
});
