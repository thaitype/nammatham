import { core } from '@nammatham/core';
import { Container } from 'inversify';
import { attachControllers } from './attach-controllers';
import { InversifyAdapterOption } from './interfaces';

export class InversifyServices extends core.BaseServices<Container> {
  constructor(protected _container: Container) {
    super();
  }

  get container() {
    return this._container;
  }
}


export class InversifyAdapter extends core.BaseAdapter<Container> {
  public container: Container;

  constructor(protected option?: InversifyAdapterOption) {
    super();
    this.option = this.option ?? {};
    this.container = this.option?.container ?? new Container();
  }

  public override getServices(): core.BaseServices<Container> {
    return new InversifyServices(this.container);
  }

  public override bootstrap(_option: core.BaseAdapterBootstarp) {
    core.bootstrap({
      controllers: _option.controllers,
      instanceResolver: (controller: core.Constructor) =>
        this.container.getNamed(core.TYPE.Controller, controller.name),
      bindControllers: () => attachControllers(this.container, _option.controllers),
    });
  }
}
