import { controller, functionName } from "@mildronize/azure-functions";

@controller()
export class UserController {
    
    @functionName("GetUsers")
    public getUsers(): void {
        console.log('getting users');
    } 
}