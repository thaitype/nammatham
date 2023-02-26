import type { PartialBy } from '../../types';
import { ServiceBusTriggerBinding } from '../interfaces';

/**
 * Create serviceBus Trigger type binding
 * 
 * read more: [serviceBus Trigger Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-trigger?tabs=in-process%2Cextensionv5&pivots=programming-language-javascript#configuration)
 *   
 * @example
 *  ```
    // Option 1: Using serviceBus implicitly 
    Binding.serviceBusTrigger({ name: 'req' as const })

    // Option 2: Using serviceBus explicitly
    Binding.serviceBusTrigger({ 
      name: 'req' as const,
      direction: 'in',
      type: 'serviceBusTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "req",
          "direction": "in",
          "type": "serviceBusTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `ServiceBusTriggerBinding`
 * @returns `ServiceBusTriggerBinding` Object with `{ type: 'serviceBusTrigger', direction: 'in' }`
 */
export function serviceBusTrigger<Binding extends ServiceBusTriggerBinding<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<ServiceBusTriggerBinding<Name>, 'type' | 'direction'>
): ServiceBusTriggerBinding<Name> {
  return {
    ...bindings,
    type: 'serviceBusTrigger',
    direction: 'in',
  };
}
