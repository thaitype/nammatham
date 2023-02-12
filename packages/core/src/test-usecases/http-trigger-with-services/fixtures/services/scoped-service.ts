import { injectable } from 'inversify';

@injectable()
export class ScopedService {
  constructor() {}

  public getData(data: string) {
    return data;
  }
}
