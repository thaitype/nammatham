

```ts
import { container } from '../container';
import { func } from '../nammatham';
import { injector } from '@di-extra/inversify';
import { DataService } from '../services/data.service';
import type { InferHandler } from '@nammatham/core';

const trigger = func
  .httpGet('hello', {
    route: 'hello-world',
  })
  .setContext({
    // prettier-ignore
    services: injector(container)
    .inject('dataService', DataService).to<DataService>()
    .resolve(),
  });

export const _handler: InferHandler<typeof trigger> = ({ trigger, context, services }) => {
  context.log('HTTP trigger function processed a request.');

  return {
    jsonBody: {
      data: 'hello world' + services.dataService.getData(),
    },
  };
};

export default trigger.handler(_handler);
```