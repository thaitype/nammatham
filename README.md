# Nammatham
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
      console.log("UserController: getting users");
      this.context.log('Context Log');

      this.res.ok(`hello get user with ${name}`);
      this.context.log('After response');
    }
  }
  ```

## TODO
- [ ] Add Log at boostrap level
- [X] Inject **Context** in Class Dependency

## Author
- Thada Wangthammang, Software Engineer, Thailand