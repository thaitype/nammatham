import { core } from '@nammatham/core';
import { container } from 'tsyringe';
import type { Container, TsyringeAdapterOption } from './interfaces';
import { attachControllers } from './attach-controllers';

export class TsyringeServices extends core.BaseServices<Container> {
  constructor(protected _container: Container) {
    super();
  }

  get container() {
    return this._container;
  }
}

export class TsyringeAdapter extends core.BaseAdapter<Container> {
  public container: Container;

  constructor(protected option?: TsyringeAdapterOption) {
    super();
    this.option = this.option ?? {};
    this.container = this.option?.container ?? container;
  }

  public override getServices(): core.BaseServices<Container> {
    return new TsyringeServices(this.container);
  }

  public override bootstrap(_option: core.BaseAdapterBootstarp) {
    core.bootstrap({
      controllers: _option.controllers,
      instanceResolver: (controller: core.Constructor) => this.container.resolve(controller as any),
      bindControllers: () => attachControllers(this.container, _option.controllers),
    });
  }
}
