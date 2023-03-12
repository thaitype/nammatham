import 'reflect-metadata';

import { bootstrap } from '@nammatham/core';
// import { A } from '@nammatham/core';
import { MyController } from './functions/http-trigger';

bootstrap({
  controllers: [MyController],
});

