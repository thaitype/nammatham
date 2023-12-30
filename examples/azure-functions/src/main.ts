import { expressServer } from '@nammatham/express';
import blob from './functions/blob';
import hello from './functions/hello';
import { app } from './nammatham';

// app.addFunctionsFromPath('functions/*.ts'); // TODO: Implement in next release
app.addFunctions(blob, hello);

if (process.env.NODE_ENV === 'development') {
  app.use(expressServer());
}
app.start();
