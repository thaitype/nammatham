import { DataService } from '../services/data.service';
import { func } from '../nammatham';

export abstract class BaseController {}

// const req = new Request();
// const res = new Response('hello world', {
//   status: 200,
//   statusText: 'OK',
//   headers: {
//     'Content-Type': 'text/plain',
//   },
// });
export class HomeController extends BaseController {
  constructor(public dataService: DataService) {
    super();
  }

  hello = func
    .httpGet('hello', {
      route: 'hello-world',
    })
    .handler(async c => {
      console.log('HTTP trigger function processed a request.');
      return {
        jsonBody: {
          data: 'hello world' + this.dataService.getData(),
        },
      };
    });
}
