import 'reflect-metadata';
import { bootstrap } from 'nammatham';
import { SampleHttpController } from './controllers/sample-http.controller';
import { MyHttpController } from './controllers/my-http.controller';

bootstrap({
  bootstrapPath: __filename,
  controllers: [SampleHttpController, MyHttpController],
});
