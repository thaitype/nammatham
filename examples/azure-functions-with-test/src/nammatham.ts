import { initNammatham } from '@nammatham/core';
import { AzureFunctionsAdapter } from '@nammatham/azure-functions';

const n = initNammatham.create(new AzureFunctionsAdapter());

export const func = n.func;
export const app = n.app;
