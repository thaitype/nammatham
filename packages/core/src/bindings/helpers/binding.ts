import type { PartialBy } from '../../types';
import { CustomFunctionBinding, HttpTriggerBinding, HttpBinding, TimerTriggerBinding } from '../interfaces';

/**
 * Create custom type binding which Nammatham doesn't support yet.
 * 
 * @example
 *  ```
    Binding.custom({
      name: 'custom' as const,
      direction: 'in',
      type: 'custom'
    })
 *  ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "custom",
          "direction": "in",
          "type": "custom"
        }
      ]
    }
    ```
 * 
 * @param bindings - `CustomFunctionBinding` Object
 * @returns `CustomFunctionBinding` Object
 */
function custom<T extends CustomFunctionBinding<unknown>>(bindings: T): CustomFunctionBinding<T['name']> {
  return bindings;
}

/**
 * Create httpTrigger type binding.
 * 
 * Use for Binding input Http Trigger with [HttpTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using httpTrigger implicitly 
    Binding.httpTrigger({ name: 'req' as const })

    // Option 2: Using httpTrigger explicitly
    Binding.httpTrigger({ 
      name: 'req' as const,
      direction: 'in',
      type: 'httpTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "req",
          "direction": "in",
          "type": "httpTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `HttpTriggerBinding`
 * @returns `HttpTriggerBinding` Object with `{ type: 'httpTrigger', direction: 'in' }`
 */
function httpTrigger<T extends PartialBy<HttpTriggerBinding<unknown>, 'type' | 'direction'>>(
  bindings: T
): HttpTriggerBinding<T['name']> {
  return {
    ...bindings,
    type: 'httpTrigger',
    direction: 'in',
  };
}

/**
 * Create http type binding.
 * 
 * Use for Binding output Http Trigger with [Http Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-output?tabs=in-process&pivots=programming-language-javascript)
 * 
 * @example
 *  ```
    // Option 1: Using http implicitly 
    Binding.http({ name: 'res' as const })

    // Option 2: Using http explicitly
    Binding.http({ 
      name: 'res' as const,
      direction: 'out',
      type: 'http'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "res",
          "direction": "out",
          "type": "http"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `HttpBinding` Object
 * @returns `HttpBinding` Object Object with `{ type: 'http', direction: 'out' }`
 */
function http<T extends PartialBy<HttpBinding<unknown>, 'type' | 'direction'>>(bindings: T): HttpBinding<T['name']> {
  return {
    ...bindings,
    type: 'http',
    direction: 'out',
  };
}


/**
 * Create http type binding with `$return` name
 * 
 * Use for Binding output Http Trigger and return the HttpResponse. Azure Function Runtime will use [the return value as HttpResponse automatically](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=v2-v3-v4-export%2Cv2-v3-v4-done%2Cv2%2Cv2-log-custom-telemetry%2Cv2-accessing-request-and-response%2Cwindows-setting-the-node-version#returning-from-the-function)
 * 
 * @example
 *  ```
    // Option 1: Using http implicitly 
    Binding.httpWithReturn()

    // Option 2: Using http explicitly
    Binding.httpWithReturn({ 
      name: '$return' as const,
      direction: 'out',
      type: 'http'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "$return",
          "direction": "out",
          "type": "http"
        }
      ]
    }
    ```

 * @param bindings - `HttpBinding` (Optional)
 * @returns `HttpBinding` Object with  `{ name: '$return', type: 'http', direction: 'out' }`
 */
function httpWithReturn<T extends PartialBy<HttpBinding<unknown>, 'name' | 'type' | 'direction'>>(
  bindings? : T
): HttpBinding<'$return'> {
  bindings = bindings ?? {} as T;
  return {
    ...bindings,
    name: '$return' as const,
    type: 'http',
    direction: 'out',
  };
}


/**
 * Create timerTrigger type binding.
 * 
 * Use for Binding input Timer Trigger with [timerTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=in-process&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using http implicitly 
    Binding.timerTrigger({ name: 'timer' as const })

    // Option 2: Using http explicitly
    Binding.timerTrigger({ 
      name: 'timer' as const,
      direction: 'in',
      type: 'timerTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "timerTrigger",
          "direction": "in",
          "type": "timerTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `TimerTriggerBinding` Object
 * @returns `TimerTriggerBinding` Object Object with `{ type: 'timerTrigger', direction: 'in' }`
 */
function timerTrigger<T extends PartialBy<TimerTriggerBinding<unknown>, 'type' | 'direction'>>(
  bindings: T
): TimerTriggerBinding<T['name']> {
  return {
    ...bindings,
    type: 'timerTrigger',
    direction: 'in',
  };
}

export default {
  httpTrigger,
  http,
  httpWithReturn,
  timerTrigger,
  custom,
};
