
<p align="center">
  <a href="http://thadaw.com/" target="blank"><img src="https://i.ibb.co/QmTh7x4/Nammatham-Logo-v2.png" width="120" alt="Nammatham Logo" /></a>
</p>

<p align="center">
Azure Function Lightweight frameworks with DI, providing type safe function triggers and bindings
</p>

<p align="center"><a href="https://github.com/mildronize/nammatham/actions/workflows/test.yml"><img src="https://github.com/mildronize/nammatham/actions/workflows/test.yml/badge.svg" alt="Build &amp; Test"></a> <a href="https://codecov.io/gh/mildronize/nammatham"><img src="https://codecov.io/gh/mildronize/nammatham/branch/main/graph/badge.svg?token=Y7ZMDKFPAN" alt="codecov"></a> <a href="https://www.npmjs.com/package/nammatham"><img src="https://img.shields.io/npm/v/nammatham" alt="npm version"></a> <a href="https://www.npmjs.com/package/nammatham"><img src="https://img.shields.io/npm/dt/nammatham" alt="npm download"></a></p>


## Description
Nammatham (นามธรรม in Thai, pronounced `/naam ma tham/`, means **abstract** in Thai) is Azure Function Nodejs Lightweight framework with Dependency Injection. Provide type safety wrapping `function.json`


## Compatibility with Azure Functions
- [Azure Function NodeJs](https://github.com/Azure/azure-functions-nodejs-worker/) : v3.x (`@azure/functions`)
- [Runtime Version](https://docs.microsoft.com/azure/azure-functions/functions-versions): 4 ([Source Code](https://github.dev/Azure/azure-functions-host/tree/release/4.x))
- Node.js Versions: 16, 18


## Introduction

**Nammatham** is a framework that allows you to use Azure Functions with TypeScript and decorators. It provides pre-defined JSON binding objects and utility functions, such as `httpTrigger`, to make it easier to create Azure Functions.

Example:

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
- Simple Framework, support all functionality with Azure Functions features
- Provide type utiltiy wrapping around `function.json`
- Better project orgnization
- Bindings & Triggers Built-in type support
  - Http
  - Timer
  - Cosmos DB, support both [v2](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript#configuration) and [v4](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger?tabs=in-process%2Cextensionv4&pivots=programming-language-javascript#configuration).
  - Blob
  - Service Bus
  - If your binding type isn't in the list, please use [custom type](docs/define-azure-function.md#custom-binding)
  - You can see [All available type support](docs/binding-type.md) or create a PR ;).
- Support TypeScript and [InversifyJS](https://github.com/inversify/Inversify) as the [Most Popular Inversion of Control Container and Dependency Injection Approach](https://npmtrends.com/awilix-vs-bottlejs-vs-inversify-vs-node-dependency-injection-vs-tsyringe-vs-typedi-vs-typescript-ioc) 
- Build Tool Agnostic, this framework just provide the library. It can work with all TypeScript build tool e.g. tsc, esbuild, etc.

## Installation
You can install nammatham using npm:

```
npm install nammatham inversify reflect-metadata --save
```

For the [InversifyJS](https://github.com/inversify/InversifyJS#-installation), please refer the documentation for usage.

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

you can define your own `function.json` in Typescript object (as you can see the variable `bindings`), this will binding type into `this.context.bindings`.

```ts
import { BaseFunction, binding, functionName } from 'nammatham';

const bindings = [
  binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  binding.http({ name: 'res' as const }), // make string to literal type
] as const;

@functionName('GetUser', ...bindings)
export class UserFunction extends BaseFunction<typeof bindings> {

  public override execute() {
    const { req } = this.context.bindings;
    //       ^---- `req` will be type HttpRequest
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
  
  public getUsers(): void {
    const { req } = this.context.bindings;
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

## Using Inversify API for Binding Services

In some cases, if you want to binding services with [Inversify Container](https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md) by yourself.
In the startup file, you can simply get the Container from `builder.container` as shown in the example below:

```ts
// src/startup.ts
import 'reflect-metadata';
import { NammathamApp } from 'nammatham';
import { UserService } from './services/user.services';
import { UserFunction } from './functions/user.function';

const builder = NammathamApp.createBuilder(__filename);
builder.addFunctions(UserFunction);
// Using Inversify Container API
builder.container.bind(Service).toSelf();

builder.build();

export default builder.getApp();
```

## Documentation

Please read the [full documentation in the repo](docs)

## Inspiration 
- [Azure Functions .NET](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-csharp?tabs=azure-cli%2Cin-process)
- [inversify-express-utils](https://github.com/inversify/inversify-express-utils) - We use inversify as a Dependency Injection Tool.
- [Nestjs](https://nestjs.com/)
- [typestack/routing-controllers](https://github.com/typestack/routing-controllers)
- [azure-middleware](https://github.com/emanuelcasco/azure-middleware) - Azure Functions Middleware Libray

## Author
- Thada Wangthammang, Software Engineer, Thailand