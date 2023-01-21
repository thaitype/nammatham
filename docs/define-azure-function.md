# Define Azure Functions

In order to define Azure Functions, simply do the following steps:
1. Define a `Controller` Class which extend class `BaseController` 
2. Using `@controller()` decorator 
3. Using `@functionName()` decorator to define our Azure Functions

## @functionName() decorator

`@functionName()` decorator gets 2 paramters:
1. Function Name
2. Azure Function Binding, which is accept array of `FunctionBinding` Object or `FunctionBinding` Object. This will be convert to [function.json](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-node?tabs=azure-cli%2Cbrowser#functionjson) (The configuration file of Azure Function)


Basically, this framework doesn't strict with some trigger, any trigger binding also support in just simply define JSON binding Object.

The example below show how to use Azure Functions with HTTP Trigger, and this framework also provide utilty like `httpTrigger` which is pre-defined JSON Binding Object in `function.json`

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

# Custom Binding

In `@functionName()` decorator support any JSON Binding Object that you can self-define it.

For example, if you want to use Timer Trigger, you can simply do like this:

```ts
import { BaseController, FunctionBinding, controller, functionName } from 'nammatham';
import { Timer } from '@azure/functions';

const timerTrigger: FunctionBinding = {
  schedule: '0 */5 * * * *',
  name: 'CheckDuplicateBucketExternal',
  type: 'timerTrigger',
  direction: 'in',
};

@controller()
export class UserController extends BaseController {

  @functionName('GetUsersBackground', timerTrigger)
  public backgroundJob(timer: Timer): void {
    const timeStamp = new Date().toISOString();
    if (timer.isPastDue) {
      this.context.log('Node is running late!');
    }
    this.context.log('Node timer trigger function ran!', timeStamp);
  }
}
```
