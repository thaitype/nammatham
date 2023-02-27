import type { PartialBy } from '../../types';
import { BlobBinding_Input, BlobBinding_Output } from '../interfaces';

/**
 * Create blob type binding with input.
 * 
 * read more: [Blob Input Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-input?tabs=in-process&pivots=programming-language-javascript#configuration)
 *  
 * @example
 *  ```
    // Option 1: Using blob implicitly 
    Binding.blob({ name: 'req' as const })

    // Option 2: Using blob explicitly
    Binding.blob({ 
      name: 'req' as const,
      direction: 'in',
      type: 'blob'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "req",
          "direction": "in",
          "type": "blob"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `BlobBinding_Input`
 * @returns `BlobBinding_Input` Object with `{ type: 'blob', direction: 'in' }`
 */
export function blob_input<Binding extends BlobBinding_Input<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<BlobBinding_Input<Name>, 'type' | 'direction'>
): BlobBinding_Input<Name> {
  return {
    ...bindings,
    type: 'blob',
    direction: 'in',
  };
}

/**
 * Create blob type binding with output.
 * 
 * read more: [Blob Output Configuration](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob-output?tabs=in-process&pivots=programming-language-javascript#configuration)
 *   
 * @example
 *  ```
    // Option 1: Using blob implicitly 
    Binding.blob({ name: 'req' as const })

    // Option 2: Using blob explicitly
    Binding.blob({ 
      name: 'req' as const,
      direction: 'out',
      type: 'blob'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "req",
          "direction": "out",
          "type": "blob"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `BlobBinding_Output`
 * @returns `BlobBinding_Output` Object with `{ type: 'blob', direction: 'out' }`
 */
export function blob_output<Binding extends BlobBinding_Output<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<BlobBinding_Output<Name>, 'type' | 'direction'>
): BlobBinding_Output<Name> {
  return {
    ...bindings,
    type: 'blob',
    direction: 'out',
  };
}
