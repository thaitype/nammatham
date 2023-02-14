# How does Nammatham works?

Nammatham is a framework for building Azure Functions using TypeScript. It works by running two steps:

1. The `bootstrap` phase generates two files for each function: `index.js` and `function.json`, using following command
    ```ts
    const builder = NammathamApp.createBuilder(__filename);
    builder.build();
    export default builder.getApp(); // Default export for each function, will use in `functionBootstrap` phase
    ```
2. The `functionBootstrap` phase is called by `index.js` from the previous step, and it loads all dependencies and returns the actual method defined in the controller, using following command
    ```ts
    import app from '../src/startup'; // from the `bootstrap` phase
    // Start execute the function
    app.run(/** ... **/);
    ```

Both phases use the `attachControllers()` function to inject the dependencies defined in the decorator `functionName` decorator. In production, only the `functionBootstrap` phase is run to execute each function endpoint. This allows for better performance and lower overhead.

Note: We use the word "Controller" to same meaning as "Function Class", to avoid confusing in the library development.

## 1. How does it work?

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
      "scriptFile": "../dist/src/functions/user.function.js"
    }
    ```

2. index.ts
    ```ts
    import 'reflect-metadata';
    import { AzureFunction, Context } from '@azure/functions';
    import { UserController } from '../src/functions/user.function';
    import app from '../src/startup';

    const GetUsers: AzureFunction = async function (
      context: Context,
      ...args: any[]
    ): Promise<void> {
      app.run({
        classTarget: UserController,
        azureFunctionParams: [context, ...args]
      });
    };

    export default GetUsers;
    ```

## 2. Understand Azure Function Runtime 

[Azure Functions Runtime](https://github.com/Azure/azure-functions-host) is a system that provides a hosting platform for Azure Functions services. In order to use the runtime, developers must create a function that takes in a specific argument, known as the `AzureFunction` type below: 

```ts
import { AzureFunction } from '@azure/functions'; // 3.5.0
type AzureFunction = (context: Context, ...args: any[]) => Promise<any> | void
```

This argument is made up of two parts:
- the **first argument**, which is injected with a `Context` object.
- the **rest of the arguments**, which are injected with any other objects specified in the `function.json` file.

For example, if you set up `function.json` like this:

```json
{
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "name": "req"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

For example, if the `function.json` file includes bindings for `httpTrigger` and `http`, the runtime will inject the matched objects, `HttpRequest` and `HttpResponse` respectively, into the function's arguments. This allows developers to use these objects within the function for handling incoming requests and sending responses, for example:

```ts
import { AzureFunction, HttpRequest, HttpResponse } from '@azure/functions'; // 3.5.0
const httpTrigger: AzureFunction = async function(context: Context, req: HttpRequest, res: HttpResponse) {
  // do something
}
```

However, we cannot use `HttpResponse` from the function arguments, so we usually provide only `HttpRequest`:

```ts
const httpTrigger = function(context: Context, req: HttpRequest){}
```

Moreover, the Azure Functions Runtime will inject the same object in `Context.bindings`, the key name will match with prop `name` in `function.json`. so, it should be a type:

```ts
type MyContextBindings = {
  req: HttpRequest;
  res: HttpResponse;
}
```

And Azure Functions Runtime will inject `req` as `HttpRequest` and `res` as `Record<string,any>` in the `Context` object, we usually use both objects in the `Context`, we usually use `Context.res` for giving response:

```ts
this.context.res = {
  status: 200,
  body: `hello world`,
};
```

However, the Azure Functions library (@azure/functions@3.5.0) does not provide a specific type for the `Context.bindings` object. This can make it difficult for developers to correctly type the objects being injected into the function. 

<!-- Nammatham solves this problem by using a `GetBindings` type to extract the type from the `function.json` file, which is defined in a TypeScript object. This allows developers to correctly type the objects being injected, such as in the example provided where the `req` object is correctly typed as an `HttpRequest` object. -->

```ts
@functionName('WithTypeUtility', ...functionBinding1)
export class WithTypeUtilityFunction extends BaseFunction<typeof functionBinding1> {

  public override execute() {
    const { req, res } = this.context.bindings;
    const name = req.query.name;
    this.context.res = {
      body: `hello WithTypeUtility with ${name}`,
    };
  }
}
```

## 3. Method Injection Mode

...

## 4. Resolve dependency in the container at startup time

....


## 5. Why a single class per azure function

Previous design, we're required to create a function bindings config (same as `function.json`) before starting declare the class.
Because we need a type of function bindings and using `GetBindings<T>` type to extract type from it.

This can make inconvenience we're using this library in a couple of reasons:
1. When you have to declare more than 1 function in a single class, the function bindings config will be seperated from the method (`@functionName` decorator) you defined the azure functions.
2. We need to use `GetBindings` type to extract type from `Context.bindings` to passing into the method arguments.

As you can see the example below:

```ts
// nammatham@0.4.0-alpha
import { BaseController, controller, functionName, GetBindings, httpTriggerBinding, HttpBinding } from 'nammatham';

const functionBinding1 = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
  } as httpTriggerBinding<'req'>,
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  } as HttpBinding<'res'>,
];

const functionBinding2 = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
  } as httpTriggerBinding<'req'>,
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  } as HttpBinding<'res'>,
];

@controller()
export class MyController extends BaseController {
  @functionName('function1', ...functionBinding1)
  public function1({ req }: GetBindings<typeof functionBinding1>): void {
    const name = req.query.name;
    this.context.res = {
      body: `hello function1 with ${name}`,
    };
  }

  @functionName('function2', ...functionBinding2)
  public function2({ req }: GetBindings<typeof functionBinding2>): void {
    const name = req.query.name;
    this.context.res = {
      body: `hello function1 with ${name}`,
    };
  }
}
```

From the above reasons, we want go get type when `Context` object already injected by Azure Functions runtime.
So, we decided to design 1 azure function per a single class which extends `BaseFunction`, and allow only implement azure function handler inside `execute` method only. 

The  `BaseFunction` will accept type of function bindings config when creating this object, the `Context` object will know the exact type, by using `this.context`. This can make the azure function class below cleaner and simple.

```ts
// nammatham version 0.5.0-alpha or above
import { BaseFunction, Binding, functionName } from 'nammatham';

const functionBinding1 = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
  } as httpTriggerBinding<'req'>,
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  } as HttpBinding<'res'>,
];


@functionName('WithTypeUtility', ...functionBinding1)
export class WithTypeUtilityFunction extends BaseFunction<typeof functionBinding1> {

  public override execute() {
    const { req, res } = this.context.bindings;
    const name = req.query.name;
    this.context.res = {
      body: `hello WithTypeUtility with ${name}`,
    };
  }
}
```

Moreover, we can use `Binding` object which a helper to create a function binding with confident type, as show below:

```ts
import { Binding } from 'nammatham';

const functionBinding1 = [
  Binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  Binding.http({ name: 'res' as const }), // make string to literal type
];
```

This is the same value as above declaration, but more fluent api.

