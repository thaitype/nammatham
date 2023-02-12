import test from 'ava';
import { ContextFactory, HttpResponseContext_TestHelper } from './test-helpers';

interface HttpResponseContextFixture {
  httpResponseContext: HttpResponseContext_TestHelper;
}

test.beforeEach(t => {
  const mockContext = ContextFactory.createBuilder().getContext();
  const httpResponseContext = new HttpResponseContext_TestHelper(mockContext);
  (t.context as any).data = { httpResponseContext } as HttpResponseContextFixture;
});

test('HttpResponseContext class should set "context.res" object properly when use "send"', t => {
  const { httpResponseContext } = (t.context as any).data as HttpResponseContextFixture;
  const body = 'bobby';
  httpResponseContext.send(body);
  t.is(httpResponseContext.context.res?.body, body);
});

test('HttpResponseContext class should set "context.res" object properly when use "json"', t => {
  const { httpResponseContext } = (t.context as any).data as HttpResponseContextFixture;
  const body = {name: 'bobby'};
  httpResponseContext.json(body);
  t.is(httpResponseContext.context.res?.body, JSON.stringify(body));
});

test('HttpResponseContext class should set "statusCode" properly when use "status"', t => {
  const { httpResponseContext } = (t.context as any).data as HttpResponseContextFixture;
  const statusCode = 404;
  httpResponseContext.status(statusCode);
  t.is(httpResponseContext.statusCode, statusCode);
});