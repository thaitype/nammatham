import { injectable } from 'inversify';

@injectable()
export class SingletonService {
  constructor() {}

  public getData(data: string) {
    return data;
  }
}
