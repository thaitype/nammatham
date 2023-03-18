import { injectable } from 'tsyringe';

@injectable()
export class MyService {
  get name() {
    return 'my-service';
  }
}
