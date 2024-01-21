import { expressPlugin } from 'nammatham';
import simpleTimer from './functions/simple-timer';
import { app } from './nammatham';

app.addFunctions(simpleTimer);

app.register(
  expressPlugin({
    allowAllFunctionsAccessByHttp: true,
  })
);
app.start();
