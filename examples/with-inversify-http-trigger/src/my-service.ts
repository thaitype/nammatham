import { injectable } from 'inversify';

@injectable()
export class MyService {
  get name() {
    return 'my-service';
  }
}
