# az-functions
Azure Function Nodejs frameworks with Dependency Injection

## Dev

```
npx ts-node examples/crud/main.ts
```

## Example
- C# Azure Functions In-Process with REST Example https://markheath.net/post/azure-functions-rest-csharp-bindings, https://github.com/markheath/funcs-todo-csharp/
- Inversify Express Util: https://github.com/inversify/inversify-express-utils
- azure-middlewares


demo output
```ts
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Container } from "inversify";
import "reflect-metadata";
import { funcBootstrap } from "@mildronize/azure-functions";
import "../../controllers/user.controller";
import { UserController } from '../../controllers/user.controller';

// set up container
const httpTrigger: AzureFunction = async function (
  context: Context,
  ...args: any[]
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const container = new Container();
  funcBootstrap(container, UserController ,"getUsers", [context, ...args]);
};

// class MockContext {
//   log(message: string){
//     console.log(message);
//   }
// }

// httpTrigger(new MockContext() as Context);
export default httpTrigger;
```