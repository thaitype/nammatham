import { injectable } from 'inversify';

@injectable()
export class DataService {

  public getData() {
    return `Hey I'm DataService`;
  }
}
