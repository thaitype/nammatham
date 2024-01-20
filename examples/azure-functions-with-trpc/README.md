# @examples/azure-functions-with-trpc

> Unstable API, please use in your own risk, any PRs are welcome!

## Usage

```ts
// No need to call expressPlugin() in dev mode, as it is already called by nammathamTrpcPlugin()
// app.register(expressPlugin());
app.register(
  unstable__tRpcAzureFunctionsPlugin({
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
    }
  })
);
```

## Run Dev Server 

```
npm run dev
```

## Run Client

```
npm run start:client
```