# nx

```sh
npx nx build nammatham
# or 
npx nx run nammatham:build
npx nx run nammatham:dev

npx nx run nammatham:test:watch


# Publish npm with nx
pnpm --filter nammatham publish
```

## Azure Functions Ecosystem
- Azure Functions Node.js: https://github.com/Azure/azure-functions-nodejs-worker (v3.x)
- [Azure Function Runtime (Host)](https://github.dev/Azure/azure-functions-host/tree/release/4.x) v4.x
- The Azure Functions runtime builds upon the [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk) to provide a hosting platform for functions written in many different [languages](https://docs.microsoft.com/en-us/azure/azure-functions/supported-languages) and supporting a wide variety of [triggers and bindings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp#supported-bindings)
  - Azure WebJobs SDK use [Azure WebJobs SDK Extensions](https://github.com/Azure/azure-webjobs-sdk-extensions)
  - In addition to the built in triggers/bindings, the WebJobs SDK is **fully extensible**, allowing new types of triggers/bindings to be created and plugged into the framework in a first class way. See [Azure WebJobs SDK Extensions](https://github.com/Azure/azure-webjobs-sdk-extensions) for details. Many useful extensions have already been created and can be used in your applications today. Extensions include a File trigger/binder, a Timer/Cron trigger, a WebHook HTTP trigger, as well as a SendGrid email binding. 
- [Register Azure Functions binding extensions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-register)
  - Need to install `Microsoft.Azure.Functions.ExtensionBundle` in `host.json` which is in https://github.com/Azure/azure-functions-extension-bundles