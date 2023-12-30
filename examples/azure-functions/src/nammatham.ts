import { initNammatham } from '@nammatham/core';
import { AzureFunctionsAdapter } from '@nammatham/azure-functions';

const n = initNammatham.create(new AzureFunctionsAdapter());
n.func;
// ^?
export const func = n.func;
export const app = n.app;
