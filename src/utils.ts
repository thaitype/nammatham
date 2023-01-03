import { METADATA_KEY } from "./contants";
import { ControllerMetadata, DecoratorTarget } from "./interfaces";

export function getControllersFromMetadata(): Array<DecoratorTarget> {
  const arrayOfControllerMetadata: Array<ControllerMetadata> =
    (Reflect.getMetadata(
      METADATA_KEY.controller,
      Reflect
    ) as Array<ControllerMetadata>) || [];
  return arrayOfControllerMetadata.map((metadata) => metadata.target);
}
