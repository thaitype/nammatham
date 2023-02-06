import { inject, injectable, decorate } from 'inversify';
import { METADATA_KEY, TYPE } from './contants';
import { ControllerMetadata, DecoratorTarget, HandlerDecorator } from './interfaces';
import { FunctionBinding, BaseFunctionBinding } from './bindings';

export const injectContext = inject(TYPE.Context);

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

  for (const binding of flattenBindings) {
    console.log(`[Binding] '' register ${binding.name} with type ${binding.type}`);
  }
  return flattenBindings;
}

export function functionName<T = null>(
  name: string,
  // ...middleware: Array<Middleware>
  ...bindings: Bindings<T>
) {
  return (target: NewableFunction): void => {
    decorate(injectable(), target);

    console.log(`Register controller target ${target.name}`);
    const currentMetadata: ControllerMetadata<T> = {
      binding: flattenBindingsArray<T>(bindings),
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

// export function functionName<T = null>(
//   name: string,
//   // ...middleware: Array<Middleware>
//   ...bindings: Array<BaseFunctionBinding<T, string> | [BaseFunctionBinding<T, string>, BaseFunctionBinding<T, string>]>
// ): HandlerDecorator {
//   return (target: DecoratorTarget, key: string): void => {
//     const flattenBindings: BaseFunctionBinding<T, string>[] = [];
//     for (const binding of bindings) {
//       if (Array.isArray(binding)) {
//         flattenBindings.push(...binding);
//       } else {
//         flattenBindings.push(binding);
//       }
//     }

//     for (const binding of flattenBindings) {
//       console.log(`[Binding] '${name}' register ${binding.name} with type ${binding.type}`);
//     }

//     const metadata: AzureFunctionMethodMetadata<T> = {
//       // key,
//       name,
//       target,
//       binding: flattenBindings,
//     };

//     let metadataList: Array<AzureFunctionMethodMetadata<T>> = [];

//     if (!Reflect.hasOwnMetadata(METADATA_KEY.azureFunction, target.constructor)) {
//       Reflect.defineMetadata(METADATA_KEY.azureFunction, metadataList, target.constructor);
//     } else {
//       metadataList = Reflect.getOwnMetadata(METADATA_KEY.azureFunction, target.constructor) as Array<
//         AzureFunctionMethodMetadata<T>
//       >;
//     }

//     metadataList.push(metadata);
//   };
// }
