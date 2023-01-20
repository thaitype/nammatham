import {
  AuthorizationLevel,
  controller,
  functionName,
  httpTrigger,
} from "nammatham";
import { Context, HttpRequest } from "@azure/functions";

@controller()
export class UserController {
  @functionName("GetUsers", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
  public getUsers(context: Context, req: HttpRequest): void {
    console.log("UserController: getting users");
    context.log('Context Log');
    context.res = {
      status: 200,
      body: 'test'
    }
  }
}
