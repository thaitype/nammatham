import type { PartialBy } from '../../types';
import { TimerTriggerBinding } from '../interfaces';

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
export function timerTrigger<Binding extends TimerTriggerBinding<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<TimerTriggerBinding<Name>, 'type' | 'direction'>
): TimerTriggerBinding<Name> {
  return {
    ...bindings,
    type: 'timerTrigger',
    direction: 'in',
  };
}
