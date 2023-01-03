import { inject, injectable, decorate } from 'inversify';
import { METADATA_KEY } from "./contants";
import { AzureFunctionMethodMetadata, ControllerMetadata, DecoratorTarget, HandlerDecorator } from "./interfaces";

export function controller( 
  // ...middleware: Array<Middleware>
  ) {
  return (target: NewableFunction): void => {
    console.log(`register controller target ${target.name}`)
    const currentMetadata: ControllerMetadata = {
      // middleware,
      target,
    };

    decorate(injectable(), target);
    Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);

    // We need to create an array that contains the metadata of all
    // the controllers in the application, the metadata cannot be
    // attached to a controller. It needs to be attached to a global
    // We attach metadata to the Reflect object itself to avoid
    // declaring additonal globals. Also, the Reflect is avaiable
    // in both node and web browsers.
    const previousMetadata: Array<ControllerMetadata> = Reflect.getMetadata(
      METADATA_KEY.controller,
      Reflect,
    ) as Array<ControllerMetadata> || [];

    const newMetadata = [currentMetadata, ...previousMetadata];

    Reflect.defineMetadata(
      METADATA_KEY.controller,
      newMetadata,
      Reflect,
    );
  };
}

export function functionName(
    name: string,
    // ...middleware: Array<Middleware>
  ): HandlerDecorator {
    return (target: DecoratorTarget, key: string): void => {
      const metadata: AzureFunctionMethodMetadata = {
        key,
        name,
        target,
      };
  
      let metadataList: Array<AzureFunctionMethodMetadata> = [];
  
      if (
        !Reflect.hasOwnMetadata(
          METADATA_KEY.azureFunction,
          target.constructor
        )
      ) {
        Reflect.defineMetadata(
          METADATA_KEY.azureFunction,
          metadataList,
          target.constructor
        );
      } else {
        metadataList = Reflect.getOwnMetadata(
          METADATA_KEY.azureFunction,
          target.constructor,
        ) as Array<AzureFunctionMethodMetadata>;
      }
  
      metadataList.push(metadata);
    };
  }