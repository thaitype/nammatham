import 'reflect-metadata';

import { bootstrap } from '@nammatham/inversify';
import { MyController } from './functions/http-trigger';

bootstrap({
  controllers: [MyController],
});

