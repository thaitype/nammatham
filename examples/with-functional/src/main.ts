import blob from './functions/blob';
import hello from './functions/hello';
import { app } from './nammatham';

// app.addFunctionsFromPath('functions/*.ts'); // TODO: Implement in next release
app.addFunctions(blob);
app.addFunction(hello);
app.start();