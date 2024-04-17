import { func } from '../nammatham';
import { DataService } from '../services/data.service';

export class HomeController {
  constructor(public dataService: DataService) {}

  hello = func
    .httpGet('hello', {
      route: 'hello-world',
    })
    .handler(async c => {
      c.context.log('HTTP trigger function processed a request.');

      return c.json({
        data: 'hello world' + this.dataService.getData(),
      });
    });
}
