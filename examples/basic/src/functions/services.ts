import { injectable } from 'inversify';

@injectable()
export class Service {
  constructor() {}

  public getData() {
    return `Hey I'm service`;
  }
}
