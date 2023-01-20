# @mildronize/azure-functions
Azure Function Nodejs Lightweight frameworks with Dependency Injection

> This project is in proof of concept stage, any issue feel free to open the issue.

## Features
- Support Azure Functions HTTP trigger

## Motivation

.NET is a first-class supported in Azure Function which 

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
  import { funcBootstrap } from '@mildronize/azure-functions';
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

## Usage
Please see in [example](examples) directory

## TODO
- [ ] Add Log at boostrap level
- [ ] Inject **Context** in Class Dependency

## Author
- Thada Wangthammang, Software Engineer, Thailand