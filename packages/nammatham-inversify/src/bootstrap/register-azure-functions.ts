import { app } from '@azure/functions';
import { BootstrapControllerMethod } from './interfaces';

function extractParameters(...args: any[]) {
  console.warn('Not implement yet');
  return args;
}

export function registerAzureFunctions(controllerMetadataList: BootstrapControllerMethod[], instanceResolver: (controller: NewableFunction) => unknown) {
  for (const controllerMetadata of controllerMetadataList) {
    const instance = instanceResolver(controllerMetadata.controller) as any;
    controllerMetadata.methodMetadataList.forEach(metadata => {
      const methodName = metadata.method.key;
      const functionName = metadata.method.name;
      const params = metadata.params;
      const handler = (triggerData: any, context: any) => {
        const args = extractParameters(triggerData, context);
        instance[methodName](...args);
      };
      app.http(functionName, {
        ...params[0].option,
        handler,
      });
    });
  }
}
