import { initNammatham, AzureFunctionsAdapter } from 'nammatham';

const n = initNammatham.create(new AzureFunctionsAdapter());

export const func = n.func;
export const app = n.app;
