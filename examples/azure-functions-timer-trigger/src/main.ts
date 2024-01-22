import { expressPlugin } from 'nammatham';
import simpleTimer from './functions/simple-timer';
import { app } from './nammatham';

app.addFunctions(simpleTimer);

const dev = process.env.NODE_ENV === 'development';

app.register(
  expressPlugin({
    dev,
    allowAllFunctionsAccessByHttp: true,
  })
);
app.start();
