import { initNammatham } from 'nammatham';

const n = initNammatham.create();
n.func;
// ^?
export const func = n.func;
export const app = n.app;
