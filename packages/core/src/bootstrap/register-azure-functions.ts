import { InvocationContext } from '@azure/functions';
import { BootstrapControllerMethod, Extras } from './interfaces';
import { Constructor, ParameterMetadata } from '../interfaces';
import { PARAMETER_TYPE } from '../contants';
import { Response } from '../extends';
import { bindTriggerWithAzureFunctions } from './bind-azure-functions';
import { extractExtras, getExtras } from './extra';

/**
 * Automatic Handle
 * - context.extraInputs.get(blobInput);
 * - context.extraOutputs.set(blobOutput, blobInputValue);
 */
function getManagedExtraArguments(context: InvocationContext, args: unknown[], extras: Extras) {
  console.warn('Function not implemented.');
  extras.inputs.forEach(({ index, config, type, option }) => {
    args[index] = context.extraInputs.get(config);
  });
  extras.outputs.forEach(({ index, config, type, option }) => {
    args[index] = {
      set: (value: unknown) => context.extraOutputs.set(config, value),
    }
  });
  return args;
}

function extractParameters(
  triggerData: unknown,
  context: InvocationContext,
  params: ParameterMetadata[],
  extras: Extras
) {
  const args: Array<unknown> = [];
  if (!params || params.length === 0) {
    return [triggerData, context];
  }

  params.forEach(({ index, type, option }) => {
    switch (type) {
      case PARAMETER_TYPE.Context:
        args[index] = context;
        break;

      case PARAMETER_TYPE.HttpTrigger:
        args[index] = triggerData;
        break;

      case PARAMETER_TYPE.BlobTrigger:
        args[index] = triggerData;
        break;

      case PARAMETER_TYPE.BlobOutputRef:
        args[index] = getExtras('outputs', extras, index).config;
        break;

      case PARAMETER_TYPE.BlobInputRef:
        args[index] = getExtras('inputs', extras, index).config;
        break;

      case PARAMETER_TYPE.Response:
        args[index] = new Response();
        break;

      default:
        args[index] = undefined;
        break;
    }
  });
  return args;
}

export function registerAzureFunctions(
  controllerMetadataList: BootstrapControllerMethod[],
  instanceResolver: (controller: Constructor) => unknown
) {
  for (const controllerMetadata of controllerMetadataList) {
    const instance = instanceResolver(controllerMetadata.controller) as Record<string, (...args: unknown[]) => unknown>;
    controllerMetadata.methodMetadataList.forEach(metadata => {
      const methodName = metadata.method.key;
      const functionName = metadata.method.name;
      const params = metadata.params;
      const extras = extractExtras(params);
      // This will called at runtime
      const handler = (triggerData: unknown, context: InvocationContext) => {
        const args = extractParameters(triggerData, context, params, extras);
        const managedArgs = getManagedExtraArguments(context, args, extras);
        return instance[methodName](...managedArgs);
      };
      bindTriggerWithAzureFunctions(functionName, handler, params, extras);
    });
  }
}
