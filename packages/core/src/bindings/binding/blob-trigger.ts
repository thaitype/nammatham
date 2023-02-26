import type { PartialBy } from '../../types';
import { BlobTriggerBinding } from '../interfaces';

/**
 * Create blobTrigger type binding.
 * 
 * read more: [BlobTrigger Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-trigger?tabs=in-process&pivots=programming-language-javascript#configuration)
 *
 * @example
 *  ```
    // Option 1: Using blobTrigger implicitly 
    Binding.blobTrigger({ name: 'req' as const })

    // Option 2: Using blobTrigger explicitly
    Binding.blobTrigger({ 
      name: 'req' as const,
      direction: 'in',
      type: 'blobTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "req",
          "direction": "in",
          "type": "blobTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `BlobTriggerBinding`
 * @returns `BlobTriggerBinding` Object with `{ type: 'blobTrigger', direction: 'in' }`
 */
export function blobTrigger<Binding extends BlobTriggerBinding<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<BlobTriggerBinding<Name>, 'type' | 'direction'>
): BlobTriggerBinding<Name> {
  return {
    ...bindings,
    type: 'blobTrigger',
    direction: 'in',
  };
}
