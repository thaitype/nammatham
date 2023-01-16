import "reflect-metadata";
import { bootstrap } from "@mildronize/azure-functions";
import { UserController } from "./src/controllers/user.controller";

bootstrap({
    bootstrapPath: __filename,
    controllers: [
        UserController
    ]
});
