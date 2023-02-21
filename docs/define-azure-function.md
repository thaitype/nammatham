# Define Azure Functions

In order to define Azure Functions, simply do the following steps:
1. Define a `Function` Class which extend class `BaseFunction` 
2. Using `@functionName` decorator at the class to define our Azure Functions

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
import { BaseFunction, Binding, functionName } from 'nammatham';

const bindings = [
  binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  binding.http({ name: 'res' as const }), // make string to literal type
] as const;

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

Providing `typeof bindings` into base class `BaseFunction<T>`, it will auto binding type into `this.context.bindings` object. For example:

```ts
const { req } = this.context.bindings;
                           // ^------
                              type TypedContext = {
                                req: HttpRequest;
                                res: HttpResponse;
                              }
```

However, the `@azure/functions` doesn't provide any type binding based on `function.json`.

In case you want custom type for binding, please read the section [Custom Binding](define-azure-function.md#custom-binding)

# Custom Binding

In `@functionName` decorator support any JSON Binding Object that you can self-define it.

For example, if you want to use `customTrigger`, you can simply do like this:

> Note: `customTrigger` type is not available in Azure Functions, just show the example of the custom type

```ts
import { BaseFunction, Binding, functionName } from 'nammatham';

const bindings = [
  binding.httpTrigger({ name: 'req' as const }), // make string to literal type
  binding.http({ name: 'res' as const }), // make string to literal type
] as const;

// the type should be supported by Azure Functions runtime
const customBindings = binding.custom({ name: 'custom' as const, direction: 'in', type: 'customTrigger' });

@functionName('CustomType', ...bindings, customBindings)
export class CustomTypeFunction extends BaseFunction<typeof bindings> {
  public override execute() {
    const { req, custom } = this.context.bindings;
    console.log(`Do something with custom binding ${custom}`);
    const name = req.query.name;

    this.context.res = {
      body: `hello get user with ${name}}`,
    };
  }
}
```

Or can use simply object like this:

```ts
const bindings = [
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

const customBindings = {
  name: 'custom',
  direction: 'in',
  type: 'customTrigger',
} as const;
```