import { injectable, decorate } from 'inversify';
import { METADATA_KEY } from './contants';
import { ControllerMetadata } from './interfaces';
import { BaseFunctionBinding } from './bindings';

type Bindings<T> = Array<
  BaseFunctionBinding<T, string> | [BaseFunctionBinding<T, string>, BaseFunctionBinding<T, string>]
>;

function flattenBindingsArray<T>(bindings: Bindings<T>) {
  const flattenBindings: BaseFunctionBinding<T, string>[] = [];
  for (const binding of bindings) {
    if (Array.isArray(binding)) {
      flattenBindings.push(...binding);
    } else {
      flattenBindings.push(binding);
    }
  }

  return flattenBindings;
}

/**
 * Use for attach the Function Class into Dependency Injection tool. It requires to bind with Inversify's Container.
 * 
 * @param name - Function Name
 * @param bindings - Azure Function Binding, which is accept array of `BaseFunctionBinding` Object or `BaseFunctionBinding` Object. This will be convert to [function.json](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#functionjson) (The configuration file of Azure Function)
 */
export function functionName<T = null>(
  name: string,
  ...bindings: Bindings<T>
) {
  return (target: NewableFunction): void => {
    decorate(injectable(), target);
    const flattenBindings = flattenBindingsArray<T>(bindings);
    const bindingMessage = flattenBindings.map(b => b.type).sort().join(', ');
    console.log(`Function: '${name}' - Binding with [${bindingMessage}]`);
    const currentMetadata: ControllerMetadata<T> = {
      binding: flattenBindings,
      name,
      target,
    };

    Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);

    // We need to create an array that contains the metadata of all
    // the controllers in the application, the metadata cannot be
    // attached to a controller. It needs to be attached to a global
    // We attach metadata to the Reflect object itself to avoid
    // declaring additonal globals. Also, the Reflect is avaiable
    // in both node and web browsers.
    const previousMetadata: Array<ControllerMetadata> =
      (Reflect.getMetadata(METADATA_KEY.controller, Reflect) as Array<ControllerMetadata>) || [];

    const newMetadata = [currentMetadata, ...previousMetadata];

    Reflect.defineMetadata(METADATA_KEY.controller, newMetadata, Reflect);
  };
}