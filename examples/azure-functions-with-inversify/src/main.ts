import 'reflect-metadata';
import { expressPlugin } from 'nammatham';
import hello from './functions/hello';
import { app } from './nammatham';

app.addFunctions(hello);

app.register(expressPlugin());
app.start();
