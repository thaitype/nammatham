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

  @functionName("GetUsers", {
    type: 'timerTrigger',
    direction: 'in',
    name: '',
    schedule: ''
  })
  public getUsers(req: HttpRequest): void {
    const name = req.query.name;  
    this.context.log('Context Log');

    // this.res.send(`hello get user with ${name}`);
    this.res.json({
      data: `hello get user with ${name}`
    });
  }
}
