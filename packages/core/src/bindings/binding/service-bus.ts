import type { PartialBy } from '../../types';
import { ServiceBusBinding_Output } from '../interfaces';

/**
 * Create serviceBus type binding with output.
 * 
 * read more: [serviceBus Output Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus-output?tabs=in-process%2Cextensionv5&pivots=programming-language-javascript#configuration)
 *   
 * @example
 *  ```
    // Option 1: Using serviceBus implicitly 
    Binding.serviceBus_output({ name: 'req' as const })

    // Option 2: Using serviceBus explicitly
    Binding.serviceBus_output({ 
      name: 'req' as const,
      direction: 'out',
      type: 'serviceBus'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "req",
          "direction": "out",
          "type": "serviceBus"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `ServiceBusBinding_Output`
 * @returns `ServiceBusBinding_Output` Object with `{ type: 'serviceBus', direction: 'out' }`
 */
export function serviceBus_output<Binding extends ServiceBusBinding_Output<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<ServiceBusBinding_Output<Name>, 'type' | 'direction'>
): ServiceBusBinding_Output<Name> {
  return {
    ...bindings,
    type: 'serviceBus',
    direction: 'out',
  };
}
