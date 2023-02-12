import { injectable } from 'inversify';

@injectable()
export class Service {
  constructor() {}

  public getData(data: string) {
    return data;
  }
}
