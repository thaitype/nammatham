import test from 'ava';
import 'reflect-metadata';
import { BaseFunction } from './base-function';
import { TypedContext } from './interfaces';
import { ContextFactory } from './test-helpers';
import { HttpResponseContext } from './http';

class MyTestFunction extends BaseFunction {
  public override execute() {}
}

class HttpResponsePublicContext extends HttpResponseContext {
  constructor(public readonly context: TypedContext<any>) {
    super(context);
  }
}

test('BaseFunction class should inject the context object properly', t => {
  const myObject = new MyTestFunction();
  const invocationId = '123';
  const httpMethod = 'GET';
  const body = 'bobby';
  const mockContext = ContextFactory.createBuilder()
    .setInvocationId(invocationId)
    .setRequest({
      method: httpMethod,
    })
    .setResponse({
      body
    })
    .getContext();
  myObject.init(mockContext as TypedContext<any>);
  // Assert Context should be injected
  t.is(myObject.getContext().invocationId, invocationId);
  // Assert Request should be injected
  t.not(myObject.getRequest(), undefined);
  t.is(myObject.getRequest()?.method, httpMethod);
  // Assert Response should be injected
  t.not(myObject.getResponse(), undefined);
  t.not((myObject.getResponse() as HttpResponsePublicContext).context.res, undefined);
  t.is((myObject.getResponse() as HttpResponsePublicContext).context.res?.body, body);
});
