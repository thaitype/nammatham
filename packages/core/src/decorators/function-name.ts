import { METADATA_KEY, TYPE } from '../contants';
import { ControllerMethodMetadata, ControllerMetadata, DecoratorTarget, HandlerDecorator } from '../interfaces';

export function functionName(name: string): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {
    const metadata: ControllerMethodMetadata = {
      key,
      name,
      target,
    };

    let metadataList: Array<ControllerMethodMetadata> = [];

    if (!Reflect.hasOwnMetadata(METADATA_KEY.azureFunction, target.constructor)) {
      Reflect.defineMetadata(METADATA_KEY.azureFunction, metadataList, target.constructor);
    } else {
      metadataList = Reflect.getOwnMetadata(
        METADATA_KEY.azureFunction,
        target.constructor
      ) as Array<ControllerMethodMetadata>;
    }

    metadataList.push(metadata);
  };
}
