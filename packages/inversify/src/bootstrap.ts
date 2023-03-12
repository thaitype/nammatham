import { Container } from 'inversify';
import { core } from '@nammatham/core';
import { attachControllers } from './attach-controllers';

export interface IBootstrapOption {
  /**
   * Allow self define container
   */
  container?: Container;
  controllers: core.IBootstrapOption['controllers'];
}

export async function bootstrap(option: IBootstrapOption) {
  const container = option.container ?? new Container();
  core.baseBootstrap({
    controllers: option.controllers,
    instanceResolver: (controller: NewableFunction) => container.getNamed(core.TYPE.Controller, controller.name),
    bindControllers: () => attachControllers(container, option.controllers),
  });
}
