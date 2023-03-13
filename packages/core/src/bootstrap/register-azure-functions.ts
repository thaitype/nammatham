import { app, InvocationContext } from '@azure/functions';
import { BootstrapControllerMethod } from './interfaces';
import { ParameterMetadata } from '../interfaces';
import { PARAMETER_TYPE } from '../contants';
import { Logger } from '../extends/invocation-context';

function getLogger(context: InvocationContext) {
  const logger: Logger = {
    log: context.log,
    trace: context.trace,
    debug: context.debug,
    info: context.info,
    warn: context.warn,
    error: context.error, 
  };
  return logger;
}

function extractParameters(triggerData: any, context: InvocationContext, params: ParameterMetadata[]) {
  const args: Array<unknown> = [];
  if (!params || params.length === 0) {
    return [triggerData, context];
  }

  params.forEach(({ index, type, option }) => {
    switch (type) {
      case PARAMETER_TYPE.Context:
        args[index] = context;
        break;

      case PARAMETER_TYPE.Logger:
        args[index] = getLogger(context);
        break;

      case PARAMETER_TYPE.HttpTrigger:
        args[index] = triggerData;
  
      default:
        args[index] = context;
        break;
    }
  });
  return args;
}

export function registerAzureFunctions(
  controllerMetadataList: BootstrapControllerMethod[],
  instanceResolver: (controller: NewableFunction) => unknown
) {
  for (const controllerMetadata of controllerMetadataList) {
    const instance = instanceResolver(controllerMetadata.controller) as any;
    controllerMetadata.methodMetadataList.forEach(metadata => {
      const methodName = metadata.method.key;
      const functionName = metadata.method.name;
      const params = metadata.params;
      const handler = (triggerData: any, context: InvocationContext) => {
        const args = extractParameters(triggerData, context, params);
        return instance[methodName](...args);
      };
      app.http(functionName, {
        ...params[0].option,
        handler,
      });
    });
  }
}
