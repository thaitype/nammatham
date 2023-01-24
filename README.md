# Nammatham
Nammatham (นามธรรม in Thai, pronounced `/naam ma tham/`) is Azure Function Nodejs Lightweight frameworks with Dependency Injection, 

[![npm version](https://img.shields.io/npm/v/nammatham)](https://www.npmjs.com/package/nammatham) [![npm download](https://img.shields.io/npm/dt/nammatham)](https://www.npmjs.com/package/nammatham)

## Installation
You can install nammatham using npm:

```
npm install nammatham inversify reflect-metadata --save
```

The `nammatham` type definitions are included in the npm module and require TypeScript 2.0 and above. Please refer to the [InversifyJS](https://github.com/inversify/InversifyJS#-installation) documentation to learn more about the installation process.

## Features
- Provide basic utility for writing Azure Functions
- Only support TypeScript and [InversifyJS](https://github.com/inversify/Inversify) as the [Most Popular Inversion of Control Container and Dependency Injection Approach](https://npmtrends.com/awilix-vs-bottlejs-vs-inversify-vs-node-dependency-injection-vs-tsyringe-vs-typedi-vs-typescript-ioc) 
- Built-in support HTTP trigger, and also [support all types of Trigger](docs/define-azure-function.md#custom-binding)
- Build Tool Agnostic, this framework just provide the library. It can work with all TypeScript build tool e.g. tsc, esbuild, etc.

## Motivation

.NET is a first-class supported in Azure Function which ... (Write Later)

We heavily get inspired from Azure Functions .NET version which provide clearly project strucutre, built-in Azure Function Configuration with the Code, and also provide built-in Dependency Injection.

### Pain Point
- **Ugly Project Structure** - Azure Functions Node.js provide only basic library to connect with Azure Function Runtime. All Functions Endpoint be in the root of the project and accept only one export in the `index.js` which is the Azure Function Runtime will inject runtime object for that such as `Context`. The other code like services, constrant, middleware must be same level of the Function Endpoints.
- **Separate JS Code and the Function configuration** - Seperately JS Code and the Function configuration make a bit hard to read how to function app works, however, [.NET version also provide configuration inline of the C# Code](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-csharp?tabs=azure-cli%2Cin-process#httpexamplecs)
    - In order to create an Azure Function endpoint, they requires 2 files
        1. [index.js](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#indexjs) which must have only one export.
        2. [function.json](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#functionjson) which is plain JSON, no autocomplete how to config, it requires to open the document to config it.
- **No Dependecy Injection** - Azure Function Node.js doesn't provide any Dependecy Injection tool, however, in [.NET Azure Function provides built-in Dependency Injection](https://learn.microsoft.com/en-us/azure/azure-functions/functions-dotnet-dependency-injection)

## Usage
Please see in [example](examples) directory

1. define `bootstrap.ts`
2. Write controller, extend with `BaseController` we will auto inject Azure Function's Context
    ```ts
    import {
      AuthorizationLevel,
      BaseController,
      controller,
      functionName,
      httpTrigger,
    } from "nammatham";
    import { HttpRequest } from "@azure/functions";

    @controller()
    export class UserController extends BaseController {

      @functionName("GetUsers", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
      public getUsers(req: HttpRequest): void {
        const name = req.query.name;  
        this.context.log('Context Log');

        // this.res.send(`hello get user with ${name}`);
        this.res.json({
          data: `hello get user with ${name}`
        });
      }
    }
    ```


## How it work

it will autogenerate, 2 files per function

1. function.json
    ```json
    {
      "bindings": [
        {
          "authLevel": "anonymous",
          "type": "httpTrigger",
          "direction": "in",
          "name": "req",
          "methods": [
            "get"
          ]
        },
        {
          "type": "http",
          "direction": "out",
          "name": "res"
        }
      ],
      "scriptFile": "../dist/src/controllers/user.controller.js"
    }
    ```

2. index.ts
    ```ts
    import 'reflect-metadata';
    import { AzureFunction, Context } from '@azure/functions';
    import { funcBootstrap } from 'nammatham';
    import { UserController } from '../src/controllers/user.controller';

    const GetUsers: AzureFunction = async function (
      context: Context,
      ...args: any[]
    ): Promise<void> {
      funcBootstrap({
        classTarget: UserController,
        methodName: 'getUsers',
        azureFunctionParams: [context, ...args]
      });
    };

    export default GetUsers;
    ```


## TODO
- [ ] Add Log at boostrap level
- [X] Inject **Context** in Class Dependency
- [ ] `@controller()` should accept prefix path, e.g. `@controller('users')`
- [ ] allow to add Middleware
- [ ] Unit Test
- [ ] functionName must be unique
- [ ] Clean generated function endpoint (already remove controller)
- [ ] Cannot Resolve Serivce from Bootstrap script


## Inspiration 
- [Azure Functions .NET](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-csharp?tabs=azure-cli%2Cin-process)
- [inversify-express-utils](https://github.com/inversify/inversify-express-utils) - We use inversify as a Dependency Injection Tool.
- [Nestjs](https://nestjs.com/)
- [typestack/routing-controllers](https://github.com/typestack/routing-controllers)

## Author
- Thada Wangthammang, Software Engineer, Thailand