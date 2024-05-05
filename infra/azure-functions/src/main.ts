import { infraConfigs } from './config';
import { createFunctionApp, destroyFunctionApp } from './azure-command';

console.log('config', infraConfigs);

await createFunctionApp(infraConfigs[0]);
// await destroyFunctionApp(infraConfigs[0]);
