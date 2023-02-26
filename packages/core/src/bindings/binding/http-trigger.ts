import type { PartialBy } from '../../types';
import { HttpTriggerBinding } from '../interfaces';

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
export function httpTrigger<Binding extends HttpTriggerBinding<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<HttpTriggerBinding<Name>, 'type' | 'direction'>
): HttpTriggerBinding<Name> {
  return {
    ...bindings,
    type: 'httpTrigger',
    direction: 'in',
  };
}
