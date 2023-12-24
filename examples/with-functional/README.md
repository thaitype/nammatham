# Expected Usage
  
Path: `src/nammatham.ts`
```typescript
import { initNammatham } from '@nammatham/runtime';
import { AzureFunctionsAdatper } from '@nammatham/runtime/adapters/azure-functions';
// import { AwsLamdaAdapter }from '@nammatham/runtime/adapters/aws-lambda';
const n = initNammatham.create(new AzureFunctions());
export const functionApp = n.app;
export const func = n.func;
```
  
Path: `src/main.ts`

```typescript
import * as nExpress from '@nammatham/server/adapters/express';
import express from 'express';
import { functionApp } from './nammatham';
import blob from './functions/blob';
import hello from './functions/hello';

functionApp.addFunctions(blob, hello);
const app = express();

app.use(
  '/api',
  nExpress.createExpressMiddleware({
    functionApp,
    createContext,
  }),
);

app.listen(2021, () => {
  console.log('listening on port 2021');
});
```
