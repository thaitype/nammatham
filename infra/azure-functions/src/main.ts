import { infraConfigs } from './config';
import { createFunctionApp } from './azure-command';

console.log('config', infraConfigs);

await createFunctionApp(infraConfigs[0]);
// await destroyFunctionApp(infraConfigs[0]);
