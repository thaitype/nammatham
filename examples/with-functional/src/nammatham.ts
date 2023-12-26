import { initNammatham, AzureFunctionsAdapter } from 'nammatham';

const n = initNammatham.create(new AzureFunctionsAdapter());
n.func;
// ^?
export const func = n.func;
export const app = n.app;

const n2 = initNammatham.create();
n2.func;
// ^?
