import type { PartialBy } from '../../types';
import { CosmosDBTriggerBinding_V4, CosmosDBTriggerBinding_V2 } from '../interfaces';

/**
 * Create cosmosDBTrigger type binding for Bundle Extension v2 or v3. It requires to install [Bundle extension v2 or v3](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#install-bundle)
 * 
 * Use for Binding input with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using cosmosDBTrigger implicitly 
    Binding.cosmosDBTrigger_v2({ name: 'documents' as const })

    // Option 2: Using cosmosDBTrigger explicitly
    Binding.cosmosDBTrigger_v2({ 
      name: 'documents' as const,
      direction: 'in',
      type: 'cosmosDBTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "documents",
          "direction": "in",
          "type": "cosmosDBTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `CosmosDBTriggerBinding_V4`
 * @returns `CosmosDBTriggerBinding_V4` Object with `{ type: 'cosmosDBTrigger', direction: 'in' }`
 */
export function cosmosDBTrigger_v2<Binding extends CosmosDBTriggerBinding_V2<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<CosmosDBTriggerBinding_V2<Name>, 'type' | 'direction'>
): CosmosDBTriggerBinding_V2<Name> {
  return {
    ...bindings,
    type: 'cosmosDBTrigger',
    direction: 'in',
  };
}

/**
 * Create cosmosDBTrigger type binding for Bundle Extension v4. It required to install [Bundle extension v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#install-bundle)
 * 
 * Use for Binding input with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using cosmosDBTrigger implicitly 
    Binding.cosmosDBTrigger_v4({ name: 'documents' as const })

    // Option 2: Using cosmosDBTrigger explicitly
    Binding.cosmosDBTrigger_v4({ 
      name: 'documents' as const,
      direction: 'in',
      type: 'cosmosDBTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "documents",
          "direction": "in",
          "type": "cosmosDBTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `CosmosDBTriggerBinding_V4`
 * @returns `CosmosDBTriggerBinding_V4` Object with `{ type: 'cosmosDBTrigger', direction: 'in' }`
 */
export function cosmosDBTrigger_v4<Binding extends CosmosDBTriggerBinding_V4<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<CosmosDBTriggerBinding_V4<Name>, 'type' | 'direction'>
): CosmosDBTriggerBinding_V4<Name> {
  return {
    ...bindings,
    type: 'cosmosDBTrigger',
    direction: 'in',
  };
}

/**
 * Create cosmosDBTrigger type binding for Bundle Extension v4. It required to install [Bundle extension v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#install-bundle)
 * 
 * Use for Binding input with [cosmosDBTrigger Type](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration)
 * 
 * @example
 *  ```
    // Option 1: Using cosmosDBTrigger implicitly 
    Binding.cosmosDBTrigger({ name: 'documents' as const })

    // Option 2: Using cosmosDBTrigger explicitly
    Binding.cosmosDBTrigger({ 
      name: 'documents' as const,
      direction: 'in',
      type: 'cosmosDBTrigger'
    })
    ```

    Passing that object into `@functionName` decorator, At boostrap phase, Nammatham will generate binding `function.json` like:
    ```json
    {
      "bindings": [
        {
          "name": "documents",
          "direction": "in",
          "type": "cosmosDBTrigger"
        }
      ]
    }
    ```
   @remark Always mark the name prop `as const`, to convert the string into literal type. So, the Nammatham will detect only literal type to map the binding object in `Context`

 * @param bindings - `CosmosDBTriggerBinding_V4`
 * @returns `CosmosDBTriggerBinding_V4` Object with `{ type: 'cosmosDBTrigger', direction: 'in' }`
 */
// export function cosmosDBTrigger<T extends PartialBy<CosmosDBTriggerBinding_V4<unknown>, 'type' | 'direction'>>(
//   bindings: T
// ) {
//   return cosmosDBTrigger_v4(bindings);
// }

export function cosmosDBTrigger<Binding extends CosmosDBTriggerBinding_V4<unknown>, Name extends Binding['name']>(
  bindings: PartialBy<CosmosDBTriggerBinding_V4<Name>, 'type' | 'direction'>
): CosmosDBTriggerBinding_V4<Name> {
  return cosmosDBTrigger_v4(bindings);
}
