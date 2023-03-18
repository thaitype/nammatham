import { injectable, InjectionToken, inject as tsyringeInject } from 'tsyringe';
import { core } from '@nammatham/core';

export function controller() {
  return (target: core.Constructor): void =>
    core.controllerFactory(target, () => injectable()(target));
}

/**
 * Parameter decorator factory that allows for interface information to be stored in the constructor's metadata
 *
 * @return {Function} The parameter decorator
 * @remark Override `inject` decorator in `tsyringe` for fixing type incorrect in TypeScrpt 5.0
 * Issues is already posted: https://github.com/microsoft/tsyringe/issues/221
 */
export function inject(token: InjectionToken<any>) {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    tsyringeInject(token)(target, propertyKey ?? '', parameterIndex);
  };
}
