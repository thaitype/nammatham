import "reflect-metadata";
import { bootstrap } from "@mildronize/azure-functions";
// This is require to import Ref: https://github.com/inversify/inversify-express-utils#important-information-about-the-controller-decorator
import "./controllers/user.controller";

bootstrap();
