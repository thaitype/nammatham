import { baseBootstrap } from '../core';
import { BaseAdapter, BaseAdapterBootstarp } from './base-adapter';
import { BaseServices } from './base-services';

export class DefaultServices extends BaseServices<void> {
  get container() {
    throw new Error(`Default Services has no any container!`);
  }
}

export class DefaultAdapter extends BaseAdapter<any> {
  public container: undefined;

  constructor() {
    super();
  }

  public override getServices(): BaseServices<void> {
    return new DefaultServices();
  }

  public override bootstrap(_option: BaseAdapterBootstarp) {
    baseBootstrap({
      controllers: _option.controllers,
    });
  }
}
