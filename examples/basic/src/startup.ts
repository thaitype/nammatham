import 'reflect-metadata';
import { NammathamApp } from 'nammatham';
import { SampleHttpController } from './controllers/sample-http.controller';
import { WithServiceController } from './controllers/with-service.controller';
import { WithTypeUtilityController } from './controllers/with-type-utility.controller';
import { Service } from './controllers/services';

const builder = NammathamApp.createBuilder(__filename);
builder.addControllers(WithServiceController, SampleHttpController, WithTypeUtilityController);
builder.addProviders(Service);
// builder.register(container => {
//   container.bind(Service).toSelf();
// });

/**
 * Using env var to enable the build process
 */
builder.build();

export default builder.getApp();
