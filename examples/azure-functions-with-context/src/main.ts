import 'reflect-metadata';
import { expressPlugin } from 'nammatham';
import hello from './functions/hello';
import { app } from './nammatham';

app.addFunctions(hello);

const dev =process.env.NODE_ENV === 'development';
app.register(expressPlugin({ dev }));
app.start();
