import 'reflect-metadata';
import { bootstrap } from 'nammatham';
import { UserController } from './controllers/user.controller';

bootstrap({
  bootstrapPath: __filename,
  controllers: [UserController],
});
