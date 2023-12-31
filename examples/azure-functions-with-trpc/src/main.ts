import { tRpcAzureFunctionsPlugin } from '@nammatham/trpc-azure-functions';
import { app } from './nammatham';
import { appRouter, createContext } from './router';

// No need to call expressServer() in dev mode, as it is already called by nammathamTrpcPlugin()
// app.use(expressServer());
app.use(
  tRpcAzureFunctionsPlugin({
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
    }
  })
);
app.start();
