# Nammatham
Nammatham (นามธรรม in Thai, pronounced `/naam ma tham/`, means **abstract** in Thai) is Azure Function Nodejs Lightweight frameworks with Dependency Injection, 

[![Build & Test](https://github.com/mildronize/nammatham/actions/workflows/test.yml/badge.svg)](https://github.com/mildronize/nammatham/actions/workflows/test.yml) [![codecov](https://codecov.io/gh/mildronize/nammatham/branch/main/graph/badge.svg?token=Y7ZMDKFPAN)](https://codecov.io/gh/mildronize/nammatham) [![npm version](https://img.shields.io/npm/v/nammatham)](https://www.npmjs.com/package/nammatham) [![npm download](https://img.shields.io/npm/dt/nammatham)](https://www.npmjs.com/package/nammatham)

## Introduction

Azure Functions is a platform for building event-driven and serverless applications. **Nammatham** is a framework that allows you to use Azure Functions with TypeScript and decorators. It provides pre-defined JSON binding objects and utility functions, such as `httpTrigger`, to make it easier to create Azure Functions.

One example of using Nammatham with Azure Functions is an HTTP trigger function, where the `httpTrigger` function returns a JSON binding object that defines the function's input and output. The `@functionName` decorators are used to define the function and specify its bindings.

```ts
import { AuthorizationLevel, BaseFunction, functionName, httpTrigger } from "nammatham";
import { HttpRequest } from "@azure/functions";

@functionName("GetUsers", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
export class UserFunction extends BaseFunction {

  public override execute(req: HttpRequest): void {
    const name = req.query.name;  
    this.res.send(`hello get user with ${name}`);
  }
}
```

## Features
- Provide basic utility for writing Azure Functions
- Only support TypeScript and [InversifyJS](https://github.com/inversify/Inversify) as the [Most Popular Inversion of Control Container and Dependency Injection Approach](https://npmtrends.com/awilix-vs-bottlejs-vs-inversify-vs-node-dependency-injection-vs-tsyringe-vs-typedi-vs-typescript-ioc) 
- Built-in support HTTP trigger, and also [support all types of Trigger](docs/define-azure-function.md#custom-binding)
- Build Tool Agnostic, this framework just provide the library. It can work with all TypeScript build tool e.g. tsc, esbuild, etc.

## Installation
You can install nammatham using npm:

```
npm install nammatham inversify reflect-metadata --save
```

The `nammatham` type definitions are included in the npm module and require TypeScript 2.0 and above. Please refer to the [InversifyJS](https://github.com/inversify/InversifyJS#-installation) documentation to learn more about the installation process.

## Motivation

This framework aims to improve the development experience for Azure Functions using Node.js by providing a clear project structure, built-in Azure Function Configuration with the code, and built-in Dependency Injection.

.NET is a first-class supported in Azure Function which ... (Write Later)

We heavily get inspired from Azure Functions .NET version which provide clearly project strucutre, built-in Azure Function Configuration with the Code, and also provide built-in Dependency Injection.

- **Ugly Project Structure** -The Azure Functions Node.js library only provides basic tools to connect with the Azure Function Runtime. All function endpoints are located in the root of the project and only accept one export in the `index.js` file, which is the Azure Function Runtime will inject runtime object for that such as `Context`. Other code such as services, constants, and middleware must be located at the same level as the function endpoints.
- **Separate JS Code and the Function configuration** - The separation of JS code and function configuration makes it harder to understand how the function app works. In contrast, the [.NET version also provide configuration inline of the C# Code](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-csharp?tabs=azure-cli%2Cin-process#httpexamplecs), no type support when binding input and output from `function.json`
    - To create an Azure Function endpoint, two files are required:
        1. [index.js](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#indexjs) which must have only one export.
        2. [function.json](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#functionjson) which is a plain JSON file with no autocomplete or easy-to-use configuration, requiring the user to open the documentation to configure it.
- **No Dependecy Injection** - Azure Functions Node.js does not provide any built-in Dependency Injection tool, unlike the [.NET Azure Function provides built-in Dependency Injection](https://learn.microsoft.com/en-us/azure/azure-functions/functions-dotnet-dependency-injection)

## Starter Project

- [Basic Nammtham Starter Template](https://github.com/mildronize/nammatham-starter)

## Getting Started

Full examples please, go to [examples](examples) directory

### 1. Basic

This is basic to use partially type support, you can follow steps below:

1. define `startup.ts` (or any name)
    ```ts
    // File: src/startup.ts
    import 'reflect-metadata';
    import { NammathamApp } from 'nammatham';
    import { SampleHttpFunction } from './functions/sample-http.function';

    const builder = NammathamApp.createBuilder(__filename);
    builder.addFunctions(SampleHttpFunction);
    builder.build();

    export default builder.getApp();
    ```
   
2. Write a function handler, extend with `BaseFunction` we will auto inject Azure Function's Context
    ```ts
    // src/functions/sample-http.function.ts
    import { AuthorizationLevel, BaseFunction, functionName, httpTrigger } from 'nammatham';
    import { HttpRequest } from '@azure/functions';

    @functionName('SampleHttp', httpTrigger(AuthorizationLevel.Anonymous, ['get']))
    export class SampleHttpFunction extends BaseFunction {
      public override execute(req: HttpRequest): void {
        const name = req.query.name;
        const message = `hello get user with ${name}`;
        this.context.log(message);
        this.res.send(message);
      }
    }
    ```
3. Add Azure Functions files at root
    - `host.json`
    - `local.settings.json`
4. Run `ts-node` to generate all Azure Functions 
    ```ts
    export nammatham_env=build; ts-node src/startup.ts && tsc
    ```
5. Start Azure Functions
    ```
    func start
    ```

### 2. Handle `function.json` config by yourself

This method will support full support type when bindings config is set, for example below:

you can define your own `function.json` in Typescript object (as you can see the variable `bindings`), this will binding type into `ContextBindings` by using type utility `GetBindings`

```ts
import { BaseFunction, Binding, functionName } from 'nammatham';

const bindings = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
];

@functionName('GetUser', ...bindings)
export class UserFunction extends BaseFunction<typeof bindings> {

  public override execute() {
    const { req } = this.context.bindings;
    const name = req.query.name;
    this.context.res = {
      body: `hello get user with ${name}}`,
    };
  }
}
```

### 3. Add Services


```ts
// src/startup.ts
import 'reflect-metadata';
import { NammathamApp } from 'nammatham';
import { UserService } from './services/user.services';
import { UserFunction } from './functions/user.function';

const builder = NammathamApp.createBuilder(__filename);
builder.addFunctions(UserFunction);
builder.configureServices(services => {
  services.addSingleton(Service);
  // services.addScoped(Service);
  // services.addTransient(Service);
});
builder.build();

export default builder.getApp();
```

define a function handler

```ts
import { AuthorizationLevel, BaseFunction, functionName, httpTrigger } from 'nammatham';
import { HttpRequest } from '@azure/functions';
import { UserService } from '../services/user.service';
import { inject } from 'inversify';

@functionName('GetUsers', httpTrigger(AuthorizationLevel.Anonymous, ['get']))
export class UserFunction extends BaseFunction {

  constructor(@inject(UserService) private userService: UserService){
    super();
  }
  
  public getUsers(req: HttpRequest): void {
    const name = req.query.name;
    const message = `hello get user with ${name}, service data: ${this.userService.getData()}`;
    this.context.log(message);
    this.res.send(message);
  }
}
```

service:

```ts
import { injectable } from 'inversify';

@injectable()
export class UserService {
  constructor() {}

  public getData() {
    return `Hey I'm service`;
  }
}
```

## Documentation

Please read the [full documentation in the repo](docs)

## TODO
- [ ] Add Log at boostrap level
- [ ] allow to add Middleware
- [ ] functionName must be unique
- [ ] Clean generated function endpoint (already remove controller)


## Inspiration 
- [Azure Functions .NET](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-csharp?tabs=azure-cli%2Cin-process)
- [inversify-express-utils](https://github.com/inversify/inversify-express-utils) - We use inversify as a Dependency Injection Tool.
- [Nestjs](https://nestjs.com/)
- [typestack/routing-controllers](https://github.com/typestack/routing-controllers)
- [azure-middleware](https://github.com/emanuelcasco/azure-middleware) - Azure Functions Middleware Libray

## Author
- Thada Wangthammang, Software Engineer, Thailand