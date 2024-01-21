import { expressPlugin } from 'nammatham';
import blob from './functions/blob';
import hello from './functions/hello';
import { app } from './nammatham';

app.addFunctions(blob, hello);

app.register(expressPlugin());
app.start();
