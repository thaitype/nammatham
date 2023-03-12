import { BaseServices } from './base-services';

export interface BaseAdapterBootstarp {
  controllers: NewableFunction[]
}

export abstract class BaseAdapter<Container> {
  public abstract container: Container;
  public abstract getServices(): BaseServices<Container>;
  public abstract bootstrap(option: BaseAdapterBootstarp): void;
}
