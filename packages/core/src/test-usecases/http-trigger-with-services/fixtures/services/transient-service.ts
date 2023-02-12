import { injectable } from 'inversify';

@injectable()
export class TransientService {
  constructor() {}

  public getData(data: string) {
    return data;
  }
}
