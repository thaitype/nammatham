# Define Azure Functions

In order to define Azure Functions, simply do the following steps:
1. Define a `Controller` Class which extend class `BaseController` 
2. Using `@controller()` decorator 

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