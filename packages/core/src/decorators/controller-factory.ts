import { METADATA_KEY } from '../contants';
import { Constructor, ControllerMetadata } from '../interfaces';

export function controllerFactory(target: Constructor, decorateFunction?: () => void) {
  const currentMetadata: ControllerMetadata = {
    target,
  };

  if (decorateFunction) decorateFunction();
  Reflect.defineMetadata(METADATA_KEY.controller, currentMetadata, target);

  // We need to create an array that contains the metadata of all
  // the controllers in the application, the metadata cannot be
  // attached to a controller. It needs to be attached to a global
  // We attach metadata to the Reflect object itself to avoid
  // declaring additonal globals. Also, the Reflect is avaiable
  // in both node and web browsers.
  const previousMetadata: ControllerMetadata[] =
    (Reflect.getMetadata(METADATA_KEY.controller, Reflect) as ControllerMetadata[] | undefined) ?? [];

  const newMetadata = [currentMetadata, ...previousMetadata];

  Reflect.defineMetadata(METADATA_KEY.controller, newMetadata, Reflect);
}
