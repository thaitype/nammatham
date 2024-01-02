import { expressPlugin } from '@nammatham/express';
import hello from './functions/hello';
import { app } from './nammatham';

app.addFunctions(hello);

app.register(
  expressPlugin({
    isDevelopment: true,
    allowAllFunctionsAccessByHttp: true,
  })
);
app.start();
