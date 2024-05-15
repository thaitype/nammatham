import type { HttpTriggerOptions } from '../dist/main';

export class NammathamBase {
  protected functions: Record<string, any>[] = [];

  public getFunctions() {
    return this.functions;
  }
}

export class Nammatham extends NammathamBase {
  public get<T extends string>(options: HttpTriggerOptions<T>) {
    return this.http({
      ...options,
      method: ['GET'],
    });
  }

  public post<T extends string>(options: HttpTriggerOptions<T>) {
    return this.http({
      ...options,
      method: ['POST'],
    });
  }

  public http<T extends string>(options: HttpTriggerOptions<T>) {
    this.functions.push(options);
    return this;
  }
}
