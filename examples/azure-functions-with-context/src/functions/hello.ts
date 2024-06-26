import { container } from '../container';
import { func } from '../nammatham';
import { injector } from '@di-extra/inversify';
import { DataService } from '../services/data.service';

// prettier-ignore
const services = injector(container)
  .inject('dataService', DataService).to<DataService>()
  .resolve();

export default func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .setContext({
    services,
  })
  .handler(async c => {
    c.context.log('HTTP trigger function processed a request.');

    return c.json({
      data: 'hello world' + services.dataService.getData(),
    });
  });
