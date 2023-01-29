# Introduction

This framework aims to improve the development experience for Azure Functions using Node.js by providing a clear project structure, built-in Azure Function Configuration with the code, and built-in Dependency Injection.

# Motivation

.NET is a first-class supported in Azure Function which ... (Write Later)

We heavily get inspired from Azure Functions .NET version which provide clearly project strucutre, built-in Azure Function Configuration with the Code, and also provide built-in Dependency Injection.

- **Ugly Project Structure** -The Azure Functions Node.js library only provides basic tools to connect with the Azure Function Runtime. All function endpoints are located in the root of the project and only accept one export in the `index.js` file, which is the Azure Function Runtime will inject runtime object for that such as `Context`. Other code such as services, constants, and middleware must be located at the same level as the function endpoints.
- **Separate JS Code and the Function configuration** - The separation of JS code and function configuration makes it harder to understand how the function app works. In contrast, the [.NET version also provide configuration inline of the C# Code](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-csharp?tabs=azure-cli%2Cin-process#httpexamplecs), no type support when binding input and output from `function.json`
    - To create an Azure Function endpoint, two files are required:
        1. [index.js](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#indexjs) which must have only one export.
        2. [function.json](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#functionjson) which is a plain JSON file with no autocomplete or easy-to-use configuration, requiring the user to open the documentation to configure it.
- **No Dependecy Injection** - Azure Functions Node.js does not provide any built-in Dependency Injection tool, unlike the [.NET Azure Function provides built-in Dependency Injection](https://learn.microsoft.com/en-us/azure/azure-functions/functions-dotnet-dependency-injection)