import { container } from 'tsyringe';

export type Container = typeof container;

export interface TsyringeAdapterOption {
  container?: Container;
}
