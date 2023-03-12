import { app, HttpRequest, InvocationContext, Timer } from '@azure/functions';
import { BootstrapControllerMethod } from './interfaces';

// app.http('httpTrigger1', {
//   methods: ['POST', 'GET'],
//   handler: async (request: HttpRequest, context: InvocationContext) => {
//     context.log(`Http function processed request for url "${request.url}"`);
//     const name = request.query.get('name') || (await request.text()) || 'world';

//     return { body: `Hello, ${name}!` };
//   },
// });

// app.timer('timerTrigger1', {
//   schedule: '0 */5 * * * *',
//   handler: (myTimer: Timer, context: InvocationContext) => {
//     var timeStamp = new Date().toISOString();
//     context.log('The current time is: ', timeStamp);
//   },
// });

function logMethod(controllerMetadata: BootstrapControllerMethod) {
  const controller = controllerMetadata.controller.name;
  console.log(`Registering ${controller}`);
  controllerMetadata.methodMetadataList.forEach(metadata => {
    const controllerName = (metadata.method.target.constructor as { name: string }).name;
    const methodName = metadata.method.key;
    const functionName = metadata.method.name;
    const params = metadata.params;

    const log = { controllerName, methodName, functionName };
    console.log(log, JSON.stringify(params, null, 2));
  });
  
}

export function registerAzureFunctions(controllerMetadataList: BootstrapControllerMethod[]) {
  for (const controllerMetadata of controllerMetadataList) {
    logMethod(controllerMetadata);
  }
}
