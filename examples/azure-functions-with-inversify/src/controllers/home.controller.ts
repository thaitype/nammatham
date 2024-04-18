import { inject, injectable } from 'inversify';
import { func } from '../nammatham';
import { DataService } from '../services/data.service';

@injectable()
export class HomeController {
  constructor(@inject(DataService) public dataService: DataService) {}

  hello = func
    .httpGet('myHello', {
      route: 'hello-world',
    })
    .handler(async c => {
      c.context.log('HTTP trigger function processed a request.');

      return c.json({
        data: 'hello world' + this.dataService.getData(),
      });
    });

  timer = func
    .timer('myTimer', {
      schedule: '0 */5 * * * *',
    })
    .handler(async c => {
      c.context.log('Timer trigger function processed a request.');
    });
}
