import { tRpcAzureFunctionsPlugin } from '@nammatham/trpc-azure-functions';
import { app } from './nammatham';
import { appRouter, createContext } from './router';

// No need to call expressPlugin() in dev mode, as it is already called by nammathamTrpcPlugin()
// app.register(expressPlugin());
app.register(
  tRpcAzureFunctionsPlugin({
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
    }
  })
);
app.start();
