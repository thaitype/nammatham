import type { Equal, Expect } from '@type-challenges/utils';
import { Context, HttpRequest, HttpResponse, Timer } from '@azure/functions';
import { BaseFunction, Binding, functionName } from '../../dist/main';
import { HttpResponseContext } from '../http';

/**
 * Case 1: Binding with timeTrigger
 */

const bindings_case1 = [
  Binding.timeTrigger({ name: 'timer' as const, schedule: '*' }), // make string to literal type
];

@functionName('TimeTrigger', ...bindings_case1)
class TimeTriggerFunction extends BaseFunction<typeof bindings_case1> {
  public override execute() {
    /**
     * Start type assertion here:
     */
    type Cases = [
      /**
       * Expecte correct type in `context.bindings.timer`
       */
      Expect<Equal<typeof this.context.bindings.timer, Timer>>,
      /**
       * Expecte correct type in `this.req` and `this.res`, based on `BaseFunction`
       */
      Expect<Equal<typeof this.req, HttpRequest | undefined>>
      // TODO: this should be equal
      // Expect<Equal<typeof this.res, HttpResponseContext>>
    ];
  }
}

/**
 * Case 2: No bindings
 */

@functionName('TimeTrigger2')
class TimeTriggerFunction2 extends BaseFunction {
  public override execute() {
    /**
     * Start type assertion here:
     */
    type OriginalContextRes = NonNullable<Context['res']>;
    type Cases = [
      /**
       * Expecte correct type in `context.bindings.timer`
       */
      Expect<Equal<typeof this.context.bindings.timer, any>>,
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