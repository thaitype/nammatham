# @nammatham/tsyringe

## Note 

inject is temporary fixing type in `@nammatham/tsyringe` until, the `tsyringe` have already fix the issues: https://github.com/microsoft/tsyringe/issues/221 on TypeScript 5.0

```ts
import { inject } from '@nammatham/tsyringe';

export class MyController {
  // This should not be error!
  constructor(@inject(MyService) protected myService: MyService) {}
}
```