import { expressPlugin } from 'nammatham';
import blob from './functions/blob';
import hello from './functions/hello';
import { app } from './nammatham';

app.addFunctions(blob, hello);

const dev = process.env.NODE_ENV === 'development';
app.register(expressPlugin({ dev }));
app.start();
