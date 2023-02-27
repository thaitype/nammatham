import type { PartialBy } from '../../types';
import { HttpBinding } from '../interfaces';

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
export function http<Binding extends HttpBinding<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<HttpBinding<Name>, 'type' | 'direction'>
): HttpBinding<Name> {
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
      Binding.http_withReturn()
  
      // Option 2: Using http explicitly
      Binding.http_withReturn({ 
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

export function http_withReturn<Binding extends HttpBinding<unknown>, Name extends Binding['name']>(
  bindings?: PartialBy<HttpBinding<Name>, 'name' | 'type' | 'direction'>
): HttpBinding<'$return'> {
  return {
    ...bindings,
    name: '$return' as const,
    type: 'http',
    direction: 'out',
  };
}