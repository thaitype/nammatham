import { expressPlugin } from '@nammatham/express';
import simpleTimer from './functions/simple-timer';
import { app } from './nammatham';

app.addFunctions(simpleTimer);

app.register(
  expressPlugin({
    allowAllFunctionsAccessByHttp: true,
  })
);
app.start();
