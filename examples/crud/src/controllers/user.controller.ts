import {
  AuthorizationLevel,
  BaseController,
  controller,
  functionName,
  httpTrigger,
} from "nammatham";
import { HttpRequest } from "@azure/functions";

@controller()
export class UserController extends BaseController {

  @functionName("GetUsers", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
  public getUsers(req: HttpRequest): void {
    const name = req.query.name;  
    console.log("UserController: getting users");
    this.context.log('Context Log');

    this.res.ok(`hello get user with ${name}`);
    this.context.log('After response');
  }
}
