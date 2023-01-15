import { Container } from 'inversify';
import 'reflect-metadata';
import { bootstrap, funcBootstrap} from '@mildronize/azure-functions';
// This is require to import Ref: https://github.com/inversify/inversify-express-utils#important-information-about-the-controller-decorator
import './controllers/user.controller';
import { UserController } from './controllers/user.controller';

// set up container
const container = new Container();

bootstrap(container);