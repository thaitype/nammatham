# Azure Functions Find out

## Table of Contents
- [Blob Trigger](blob-trigger.md)
- [function.json TypeScript schema](functionSchema.ts), converted from <http://json.schemastore.org/function>

## Azure Functions Ecosystem
- Azure Functions Node.js: https://github.com/Azure/azure-functions-nodejs-worker (v3.x)
- [Azure Function Runtime (Host)](https://github.dev/Azure/azure-functions-host/tree/release/4.x) v4.x
- The Azure Functions runtime builds upon the [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk) to provide a hosting platform for functions written in many different [languages](https://docs.microsoft.com/en-us/azure/azure-functions/supported-languages) and supporting a wide variety of [triggers and bindings](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp#supported-bindings)
  - Azure WebJobs SDK use [Azure WebJobs SDK Extensions](https://github.com/Azure/azure-webjobs-sdk-extensions)
  - In addition to the built in triggers/bindings, the WebJobs SDK is **fully extensible**, allowing new types of triggers/bindings to be created and plugged into the framework in a first class way. See [Azure WebJobs SDK Extensions](https://github.com/Azure/azure-webjobs-sdk-extensions) for details. Many useful extensions have already been created and can be used in your applications today. Extensions include a File trigger/binder, a Timer/Cron trigger, a WebHook HTTP trigger, as well as a SendGrid email binding. 
- [Register Azure Functions binding extensions](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-register)
  - Need to install `Microsoft.Azure.Functions.ExtensionBundle` in `host.json` which is in https://github.com/Azure/azure-functions-extension-bundles

## Useful Resources
- https://www.youtube.com/@MicrosoftDeveloper/search?query=azure%20functions

## Azure Functions Updates
- Node.js 18 LTS is already GA https://techcommunity.microsoft.com/t5/apps-on-azure-blog/azure-functions-2022-recap-and-2023-sneak-peek/ba-p/3710636

## Azure Functions Bindings Examples
- SQL Bindings
  - (JS) Developing with Azure SQL bindings and Azure SQL trigger for Azure Functions | Data Exposed @ PASS Summit https://youtu.be/01nhp4OAk0c, blog: https://devblogs.microsoft.com/azure-sql/developing-with-azure-sql-bindings-and-azure-sql-trigger-for-azure-functions/
  - Additional samples in the Azure SQL bindings for Azure Functions repository. https://github.com/Azure/azure-functions-sql-extension
  - (C#) For an introduction to utilizing Azure SQL bindings for Azure Functions with Azure Static Web Apps, check out this video from //Build 2022. https://www.youtube.com/watch?v=Iip8zWGn7Ew

- Cosmos DB Bindings
  - The [Azure Cosmos DB Azure Functions extension version 4](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB) is now GA [Under the hood of the new Azure Functions extension for Azure Cosmos DB by Matias Quaranta](https://devblogs.microsoft.com/cosmosdb/under-the-hood-of-the-new-azure-functions-extension-for-azure-cosmos-db/)
  - [Java] [Create a Java Azure Cosmos DB Function Trigger using Visual Studio Code in 2 minutes!](https://devblogs.microsoft.com/cosmosdb/create-a-java-azure-cosmos-db-function-trigger-using-visual-studio-code-in-2-minutes/)
  - [.NET] [Create a .NET Azure Cosmos DB Function Trigger using Visual Studio Code in 2 minutes!](https://devblogs.microsoft.com/cosmosdb/cosmos-db-function-trigger-2-min/)