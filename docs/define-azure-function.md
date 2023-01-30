# Define Azure Functions

In order to define Azure Functions, simply do the following steps:
1. Define a `Controller` Class which extend class `BaseController` 
2. Using `@controller` decorator 
3. Using `@functionName` decorator to define our Azure Functions

## @functionName decorator

`@functionName` decorator gets 2 paramters:
1. Function Name
2. Azure Function Binding, which is accept array of `BaseFunctionBinding` Object or `BaseFunctionBinding` Object. This will be convert to [function.json](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#functionjson) (The configuration file of Azure Function)

As you can see in the function defintion:

```ts
function functionName<T = null>(
  name: string,
   ...bindings: Array<
    BaseFunctionBinding<T, string> | 
    [BaseFunctionBinding<T, string>, BaseFunctionBinding<T, string>]
    >
): HandlerDecorator;
```


Basically, this framework doesn't strict with some trigger, any trigger binding also support in just simply define JSON binding Object.

The example below show how to use Azure Functions with HTTP Trigger, This framework also provides a utility function like `httpTrigger` which is pre-defined JSON Binding Object in `function.json` file.

```ts
import { AuthorizationLevel, BaseController, controller, functionName, httpTrigger } from "nammatham";
import { HttpRequest } from "@azure/functions";

@controller()
export class UserController extends BaseController {

  @functionName("GetUsers", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
  public getUsers(req: HttpRequest): void {
    const name = req.query.name;  
    this.res.send(`hello get user with ${name}`);
  }
}
```

As you can see, we use `httpTrigger` function like this:

```ts
httpTrigger(AuthorizationLevel.Anonymous, ["get"])
```

the `httpTrigger` function will return simple JSON Binding Object like this:

```json
[
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
]
```


## Using Built-in Type Supported in Binding 

In case your want to define your [function.json](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#functionjson) by yourself, you just simply create array of `FunctionBinding` type and passing into the `@functionName` decorator, using spread operator `...`

```ts
import { BaseController, controller, functionName, GetContextBindings, HttpTriggerRequestBinding, HttpTriggerResponseBinding, CustomFunctionBinding } from 'nammatham';

const functionConfig = [
  {
    // This will be type error due to enum
    // Will fix in the issue #23
    authLevel: "anonymous",
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
    methods: ["get"],
  } as HttpTriggerRequestBinding<'req'>,
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  } as HttpTriggerResponseBinding<'res'>,
];

@controller()
export class HelloTypeController extends BaseController {
  @functionName('HelloType', ...functionConfig)
  public getName({ req }: GetContextBindings<typeof functionConfig>): void {
    const name = req.query.name;
    // this context will have the correct type of Response
    this.context.res = {
      body: `hello HelloType with ${name}`,
    };
  }
}
```

In case you want custom type for binding, please read the section [Custom Binding](define-azure-function.md#custom-binding)

# Custom Binding

In `@functionName` decorator support any JSON Binding Object that you can self-define it.

For example, if you want to use `custom-type`, you can simply do like this:

> Note: `custom-type` type is not available in Azure Functions, just show the example of the custom type

```ts
import {
  BaseController,
  controller,
  functionName,
  GetContextBindings,
  HttpTriggerRequestBinding,
  HttpTriggerResponseBinding,
  CustomFunctionBinding
} from 'nammatham';

const functionConfig = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
  } as HttpTriggerRequestBinding<'req'>,
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  } as HttpTriggerResponseBinding<'res'>,
];

 /**
   * To support other trigger type,
   * Using Custom Function Binding instead
   */
const unsupportType : CustomFunctionBinding<'unsupport'> = {
  name: 'unsupport',
  type: 'unsupport-type',
  direction: 'in',
};

@controller()
export class WithTypeUtilityController extends BaseController {
  
  // `unsupport-type` will make the function disable
  // This only show how to use `CustomFunctionBinding`
  @functionName('WithTypeUtility', ...functionConfig, unsupportType)
  public getName({ req, unsupport }: GetContextBindings<typeof functionConfig>): void {
    const name = req.query.name;
    this.context.res = {
      body: `xx hello WithTypeUtility with ${name}, unsupport value = ${unsupport}`
    }
  }
}
```

Or can use simply object like this:

```ts
const functionConfig = [
  {
    name: 'req',
    type: 'httpTrigger',
    direction: 'in',
  },
  {
    name: 'res',
    direction: 'out',
    type: 'http',
  },
] as const;
```