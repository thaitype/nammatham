import type { Equal, Expect } from '@type-challenges/utils';
import { Context, HttpRequest, HttpResponse, Timer } from '@azure/functions';
import { BaseFunction, Binding, functionName } from '../../';

/**
 * Case 1: Binding with httpTrigger and http
 */

const bindings_case1 = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
] as const;

@functionName('HttpTrigger', ...bindings_case1)
class HttpTriggerFunction extends BaseFunction<typeof bindings_case1> {
  public override execute() {
    /**
     * Start type assertion here:
     */
    type Cases = [
      /**
       * Expecte correct type in `context.bindings.req` and `context.bindings.res`
       */
      Expect<Equal<typeof this.context.bindings.req, HttpRequest>>,
      Expect<Equal<typeof this.context.bindings.res, HttpResponse>>,
      /**
       * Expecte correct type in `context.req` and `context.res`
       */
      Expect<Equal<typeof this.context.req, HttpRequest>>,
      Expect<Equal<typeof this.context.res, HttpResponse>>,
      /**
       * Expecte correct type in `this.req` and `this.res`, based on `BaseFunction`
       */
      Expect<Equal<typeof this.req, HttpRequest>>
      // TODO: this should be equal
      // Expect<Equal<typeof this.res, HttpResponseContext>>
    ];
  }
}

/**
 * Case 2: No bindings
 */

@functionName('HttpTrigger2')
class HttpTriggerFunction2 extends BaseFunction {
  public override execute() {
    /**
     * Start type assertion here:
     */
    type OriginalContextRes = NonNullable<Context['res']>;
    type Cases = [
      /**
       * Expecte correct type in `context.bindings.req` and `context.bindings.res`
       */
      Expect<Equal<typeof this.context.bindings.req, any>>,
      Expect<Equal<typeof this.context.bindings.res, any>>,
      /**
       * Expecte correct type in `context.req` and `context.res`
       */
      Expect<Equal<typeof this.context.req, HttpRequest | undefined>>,
      Expect<Equal<typeof this.context.res, OriginalContextRes | undefined>>,
      /**
       * Expecte correct type in `this.req` and `this.res`, based on `BaseFunction`
       */
      Expect<Equal<typeof this.req, HttpRequest | undefined>>
      // TODO: this should be equal
      //   Expect<Equal<typeof this.res, HttpResponseContext | undefined>>
    ];
  }
}
