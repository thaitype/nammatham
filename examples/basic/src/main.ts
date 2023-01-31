import 'reflect-metadata';
import { NammathamApp } from 'nammatham';
import { SampleHttpController } from './controllers/sample-http.controller';
import { WithServiceController } from './controllers/with-service.controller';
import { WithTypeUtilityController } from './controllers/with-type-utility.controller';
import { Service } from './controllers/services';

const builder = NammathamApp.createBuilder(__filename);
builder.addModule({
  controllers: [WithServiceController, SampleHttpController, WithTypeUtilityController],
  providers: [Service],
  // register: container => {
  //   container.bind(Service).toSelf();
  // }
});
/**
 * Using env var to enable the build process 
 */
builder.build();

export default builder.createApp();


// builder.addModule({
//   controllers: [WithServiceController],
//   providers: [Service],
//   register: container => {
//     container.bind(Service).toSelf();
//   }
// });

/**
 * funcBoostrap()
 * import app from '';
 *
 * app.run({
    classTarget: SampleHttpController,
    methodName: 'getName',
    azureFunctionParams: [context, ...args]
  });
 */