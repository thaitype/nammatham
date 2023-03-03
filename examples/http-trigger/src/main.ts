import 'reflect-metadata';
import { bootstrap } from '@nammatham/inversify';
import { SampleHttpController } from './controllers/sample-http.controller';
import { MyHttpController } from './controllers/my-http.controller';
import { WithTypeUtilityController } from './controllers/with-type-utility.controller';

bootstrap({
  bootstrapPath: __filename,
  controllers: [SampleHttpController, MyHttpController, WithTypeUtilityController],
});
