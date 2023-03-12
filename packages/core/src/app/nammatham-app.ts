import { BaseAdapter } from './base-adapter';
import { BaseServices } from './base-services';
import { DefaultAdapter } from './default-adapter';

class FunctionApp<Adapter extends BaseAdapter<unknown>> {
  protected _controllers: NewableFunction[] = [];
  protected _services!: BaseServices<Adapter['container']>;

  constructor(protected adapter: Adapter) {
    if (adapter) this._services = adapter.getServices();
  }

  public addControllers(...controllers: NewableFunction[]) {
    this._controllers.push(...controllers);
    return this;
  }

  get services() {
    return this._services;
  }

  public run() {
    this.adapter.bootstrap({
      controllers: this._controllers,
    });
  }
}

export class NammathamFactory {
  public static create<T extends BaseAdapter<unknown>>(adapter?: T) {
    if(adapter === undefined) return new FunctionApp<T>(new DefaultAdapter() as any);
    return new FunctionApp<T>(adapter);
  }
}
