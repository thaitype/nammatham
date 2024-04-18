import { inject } from 'inversify';
import { func } from '../nammatham';
import { DataService } from '../services/data.service';

export class UserController {
  constructor(@inject(DataService) public dataService: DataService) {}

  getUser = func
    .httpGet('getUser')
    .handler(async c => {
      c.context.log('HTTP trigger function processed a request.');

      return c.json({
        data: 'hello world' + this.dataService.getData(),
      });
    });
}
