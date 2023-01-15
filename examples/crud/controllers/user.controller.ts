import {
  AuthorizationLevel,
  controller,
  functionName,
  httpTrigger,
} from "@mildronize/azure-functions";

@controller()
export class UserController {
  @functionName("GetUsers", httpTrigger(AuthorizationLevel.Anonymous, ["get"]))
  public getUsers(): void {
    console.log("UserController: getting users");
  }
}
