# [0.3.0-alpha.1](https://github.com/mildronize/nammatham/releases/tag/0.3.0-alpha.1)

## What's Changed
- Add Type Support for [TimerTrigger](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-timer?tabs=in-process&pivots=programming-language-javascript#configuration) in FunctionBinding interface
- Make Type support Custom Function Binding
- Fix Bug: "Bootstrap function cannot support more than 1 controller"

### Custom Function Binding

In `@functionName()` decorator support any JSON Binding Object that you can self-define it.

For example, if you want to use `custom-type`, you can simply do like this:

> Note: `custom-type` type is not available in Azure Functions, just show the example of the custom type

```ts
import { BaseController, controller, functionName } from 'nammatham';

@controller()
export class SampleHttpController extends BaseController {
  
  /**
   * To support other trigger type,
   * Using Custom Function Binding instead
   */
  @functionName<string>('SampleCustomFunctionBinding', {
    name: 'SampleCustomFunctionBinding',
    type: 'custom-type',
    direction: 'in'
  })
  public customFunctionBinding(): void {
    this.context.log(`Running custom binding funtion`);
  }
}
```

## Pull Requests
* Add Type Support for Timer Trigger in FunctionBinding interface by @mildronize in https://github.com/mildronize/nammatham/pull/9
* Fix Bootstrap function cannot support more than 1 controller by @mildronize in https://github.com/mildronize/nammatham/pull/10


**Full Changelog**: https://github.com/mildronize/nammatham/compare/0.2.0-alpha.1...0.3.0-alpha.1

# [0.2.0-alpha.1](https://github.com/mildronize/nammatham/releases/tag/0.2.0-alpha.1)

## What's Changed

previously, the bootstrap script (`main.ts` or any filename) which is required to setup this library, it must be at root level of the project.
In this release, we make this script to be any location in the project, 

**For example,** 
 - Previously, the bootstrap script is `/main.ts`
 - Currently, the bootstrap script is `/src/main.ts`

```diff
  .
  ├── host.json
  ├── local.settings.json
- ├── main.ts
  ├── package-lock.json
  ├── package.json
  ├── src
  │   ├── controllers
  │   │   └── user.controller.ts
+ │   └── main.ts
  └── tsconfig.json
```

## Pull Requests
* Feat: Bootstrap can be changed location by @mildronize in https://github.com/mildronize/nammatham/pull/5


**Full Changelog**: https://github.com/mildronize/nammatham/compare/0.1.0-alpha.1...0.2.0-alpha.1

# [0.1.0-alpha.1](https://github.com/mildronize/nammatham/releases/tag/0.1.0-alpha.1)

## What's Changed

### Background

When you define Azure Function with [HttpTrigger](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook?tabs=in-process%2Cfunctionsv2&pivots=programming-language-javascript) in TypeScript, we usually define like this: 

```ts
import { Context, HttpRequest } from "@azure/functions";
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.');
};

export default httpTrigger;
```

the type `AzureFunction` is [already defined type](https://github.com/Azure/azure-functions-nodejs-library/blob/v3.x/types/index.d.ts#L26) with

```ts
type AzureFunction = (context: Context, ...args: any[]) => Promise<any> | void;
```

The first argument is always `Context` and the rest is an array of `any` object, 
When you using HttpTrigger, the next argument will be `HttpRequest`,

So, In this release, we've changed the way defined function which automatically inject the `Context` object from Azure Function runtime into our defined class, as you can see in the before & after examples.

**Before**

```ts
import { AuthorizationLevel, controller, functionName, httpTrigger } from "nammatham";
import { Context, HttpRequest } from "@azure/functions";

@controller()
export class UserController {

  @functionName("GetUsers", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
  public getUsers(context: Context, req: HttpRequest): void {
    const name = req.query.name;  
    context.res = {
      status: 200,
      body: `hello get user with ${name}`
    }
  }
}
```

**After**

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

You can see the full example in [example/crud](https://github.com/mildronize/nammatham/blob/0.1.0-alpha.1/examples/crud/src/controllers/user.controller.ts) `UserController`.

Compatible with @azure/functions@3.5.0 

## Pull Requests
* inject Az Function Context in controller class by @mildronize in https://github.com/mildronize/nammatham/pull/3
* Refactor HttpResponse & Re-Export http-status-codes by @mildronize in https://github.com/mildronize/nammatham/pull/4

**Full Changelog**: https://github.com/mildronize/nammatham/compare/0.0.1-pre-alpha.5...0.1.0-alpha.1

# [0.0.1-pre-alpha.5](https://github.com/mildronize/nammatham/releases/tag/0.0.1-pre-alpha.5)

## What's Changed
* Add HttpTrigger on AzureFunction and generate script by @mildronize in https://github.com/mildronize/nammatham/pull/1
* fix: Az function script file to correct path by @mildronize in https://github.com/mildronize/nammatham/pull/2


**Full Changelog**: https://github.com/mildronize/nammatham/commits/0.0.1-pre-alpha.5