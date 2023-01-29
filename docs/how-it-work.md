# How Nammatham works?

Nammatham is a framework for building Azure Functions using TypeScript. It works by running two steps during the development process:

1. The `bootstrap` phase generates two files for each function: `index.js` and `function.json`.
2. The `functionBootstrap` phase is called by `index.js` from the previous step and it loads all dependencies and returns the actual method defined in the controller.

Both phases use the `attachControllers()` function to inject the dependencies defined in the decorator such as `controller` and `functionName` decorator. In production, only the `functionBootstrap` phase is run to execute each function endpoint. This allows for better performance and lower overhead.

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
