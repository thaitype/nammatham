import { inject } from 'inversify';
import { HomeController } from '../controllers/home.controller';
import { app } from '../nammatham';
import { UserController } from '../controllers/user.controller';

export class AppService {
  constructor(
    @inject(HomeController) public homeController: HomeController,
    @inject(UserController) public userController: UserController
  ) {}

  appFunctions = app.createFunctions({
    hello: this.homeController.hello,
    user: this.userController.getUser,
  });


type AppServiceType = AppService['appFunctions'];
