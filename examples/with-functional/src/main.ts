import { expressServer } from 'nammatham';
import blob from './functions/blob';
import hello from './functions/hello';
import { app } from './nammatham';

// app.addFunctionsFromPath('functions/*.ts'); // TODO: Implement in next release
app.addFunctions(blob, hello);

app.use(expressServer());
app.start();
