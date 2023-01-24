# Introduction

... Later

# Motivation

.NET is a first-class supported in Azure Function which ... (Write Later)

We heavily get inspired from Azure Functions .NET version which provide clearly project strucutre, built-in Azure Function Configuration with the Code, and also provide built-in Dependency Injection.


- **Ugly Project Structure** - Azure Functions Node.js provide only basic library to connect with Azure Function Runtime. All Functions Endpoint be in the root of the project and accept only one export in the `index.js` which is the Azure Function Runtime will inject runtime object for that such as `Context`. The other code like services, constrant, middleware must be same level of the Function Endpoints.
- **Separate JS Code and the Function configuration** - Seperately JS Code and the Function configuration make a bit hard to read how to function app works, however, [.NET version also provide configuration inline of the C# Code](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-csharp?tabs=azure-cli%2Cin-process#httpexamplecs)
    - In order to create an Azure Function endpoint, they requires 2 files
        1. [index.js](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#indexjs) which must have only one export.
        2. [function.json](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#functionjson) which is plain JSON, no autocomplete how to config, it requires to open the document to config it.
- **No Dependecy Injection** - Azure Function Node.js doesn't provide any Dependecy Injection tool, however, in [.NET Azure Function provides built-in Dependency Injection](https://learn.microsoft.com/en-us/azure/azure-functions/functions-dotnet-dependency-injection)