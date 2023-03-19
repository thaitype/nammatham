import { InvocationContext } from '@azure/functions';
import { BootstrapControllerMethod } from './interfaces';
import { Constructor, ParameterMetadata } from '../interfaces';
import { PARAMETER_TYPE } from '../contants';
import { Response } from '../extends';
import { bindTriggerWithAzureFunctions } from './bind-azure-functions';

function extractParameters(triggerData: unknown, context: InvocationContext, params: ParameterMetadata[]) {
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

      case PARAMETER_TYPE.BlobOutput:
        args[index] = null;
        break;

      case PARAMETER_TYPE.Response:
        args[index] = new Response();
        break;

      default:
        args[index] = context;
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
    const instance = instanceResolver(controllerMetadata.controller) as any;
    controllerMetadata.methodMetadataList.forEach(metadata => {
      const methodName = metadata.method.key;
      const functionName = metadata.method.name;
      const params = metadata.params;
      const handler = (triggerData: unknown, context: InvocationContext) => {
        const args = extractParameters(triggerData, context, params);
        return instance[methodName](...args);
      };
      bindTriggerWithAzureFunctions(functionName, handler, params);
    });
  }
}
