import { METADATA_KEY } from '../contants';
import { ControllerMethodMetadata, DecoratorTarget, HandlerDecorator } from '../interfaces';

export function FunctionName(name: string): HandlerDecorator {
  return (target: DecoratorTarget, key: string): void => {
    const metadata: ControllerMethodMetadata = {
      key,
      name,
      target,
    };

    let metadataList: ControllerMethodMetadata[] = [];

    if (!Reflect.hasOwnMetadata(METADATA_KEY.azureFunction, target.constructor)) {
      Reflect.defineMetadata(METADATA_KEY.azureFunction, metadataList, target.constructor);
    } else {
      metadataList = Reflect.getOwnMetadata(
        METADATA_KEY.azureFunction,
        target.constructor
      ) as ControllerMethodMetadata[];
    }

    metadataList.push(metadata);
  };
}
