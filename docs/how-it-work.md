# How Nammatham works?

Nammatham is a framework for building Azure Functions using TypeScript. It works by running two steps:

1. The `bootstrap` phase generates two files for each function: `index.js` and `function.json`, using following command
    ```ts
    const builder = NammathamApp.createBuilder(__filename);
    builder.build();
    export default builder.getApp(); // Default export for each function, will use in `functionBootstrap` phase
    ```
2. The `functionBootstrap` phase is called by `index.js` from the previous step and it loads all dependencies and returns the actual method defined in the controller, using following command
    ```ts
    import app from '../src/startup'; // from the `bootstrap` phase
    // Start exectue the function
    app.run(/** ... **/);
    ```

Both phases use the `attachControllers()` function to inject the dependencies defined in the decorator such as `controller` and `functionName` decorator. In production, only the `functionBootstrap` phase is run to execute each function endpoint. This allows for better performance and lower overhead.

## 1. How it work

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
    import { UserController } from '../src/controllers/user.controller';
    import app from '../src/startup';

    const GetUsers: AzureFunction = async function (
      context: Context,
      ...args: any[]
    ): Promise<void> {
      app.run({
        classTarget: UserController,
        methodName: 'getName',
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

For example, if you setup `function.json` like this:

```json
{
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
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
const httpTrigger: AzureFunction = async function(context: Context, req: HttpRequest, res: HttpReponse) {
  // do something
}
```

However, we cannot use `HttpReponse` from the function arguments, so we usually provide only `HttpRequest`:

```ts
function(context: Context, req: HttpRequest){}
```

Moreover, the Azure Functions Runtime will inject the same object in `Context.bindings`, the key name will match with prop `name` in `function.json`. so, it should be a type:

```ts
type MyContextBindings = {
  req: HttpRequest;
  res: HttpResponse;
}
```

And Azure Functions Runtime will inject `req` as `HttpRequest` and `res` as `Record<string,any>` in the `Context` object, we usally use both objects in the `Context`, we usually use `Context.res` for giving response:

```ts
this.context.res = {
  status: 200,
  body: `hello world`,
};
```

However, the Azure Functions library (@azure/functions@3.5.0) does not provide a specific type for the `Context.bindings` object. This can make it difficult for developers to correctly type the objects being injected into the function. 

Nammatham solves this problem by using a `GetContextBindings` type to extract the type from the `function.json` file, which is defined in a TypeScript object. This allows developers to correctly type the objects being injected, such as in the example provided where the `req` object is correctly typed as an `HttpRequest` object.

```ts
@controller()
export class HelloTypeController extends BaseController {
  @functionName('HelloType', ...functionConfig)
  public getName({ req }: GetContextBindings<typeof functionConfig>): void {
    const name = req.query.name;
    this.res.send(`hello get user with ${name}`);
  }
}
```

## 3. Method Injection Mode

In the `functionBootstrap` phase, it will check `useHelper` is true or not, for code below:

```ts
export function funcBootstrap(option: IFuncBootstrapOption) {
  // ... the other code
  controllerInstance.init(azureFunctionContext);
  if(useHelper){
    /** Use Helper Mode **/
    (controllerInstance as any)[option.methodName](...azureFunctionArgs);
  } else {
    /** Use Manual Mode **/
    (controllerInstance as any)[option.methodName](azureFunctionContext.bindings, ...azureFunctionArgs);
  }
}
```

### 3.1 Use Helper Mode

When you using `useHelper` to be `true`, because the built-in like `httpTrigger` already has a key `useHelper` to be `true`, for example: 

```ts
@functionName("GetUsers", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
public getUsers(req: HttpRequest): void {
  const name = req.query.name;  
  this.res.send(`hello get user with ${name}`);
}
```

### 3.2 Use Manual Mode

When using `useHelper` to be `false` or unset, for example:

```ts        
const functionConfig = [
  {
    name: 'timer',
    direction: 'in',
    type: 'timerTrigger'
  } as TimerTriggerBinding<'timer'>,
];

@controller()
export class TimerController extends BaseController {
  
  @functionName('Timer', ...functionConfig)
  public run({ timer }: GetContextBindings<typeof functionConfig>): void {
    if(timer.isPastDue){
      this.context.log('The functions is past due');
    }
  }
}
```

but if you still first argument injection with `ContextBindings`, just simply add `useHelper` to be true:

```ts
const functionConfig = [
  {
    name: 'timer',
    direction: 'in',
    type: 'timerTrigger'
    useHelper: true
  } as TimerTriggerBinding<'timer'>,
];
```

## 4. Resolve dependency in the container at startup time

Resolves dependency in the container at startup time.

when the user call `builder.build()`, it will resolve at startup time in both `bootstrap` and `funcBootstrap` phases

```ts
/**
 * Binding at root in both build & runtime mode
 */
this.functionApp.bindModuleWithContainer(this.container);
```

The bindModuleWithContainer will bind all controllers, providers, and custom register with giving container. 

```ts
public bindModuleWithContainer(container: Container) {
  const { register } = this.option;
  /**
   * Binding root module
   */
  attachProviders(container, this.option.providers || []);
  attachControllers(container, this.option.controllers || []);
  if(register) register(container);
}
```

## 5. Why a single class per azure function

...