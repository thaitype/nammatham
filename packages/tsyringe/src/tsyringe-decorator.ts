import { InjectionToken, inject as tsyringeInject } from 'tsyringe';

/**
 * Parameter decorator factory that allows for interface information to be stored in the constructor's metadata
 *
 * @return {Function} The parameter decorator
 * @remark Override `inject` decorator in `tsyringe` for fixing type incorrect in TypeScrpt 5.0
 * Issues is already posted: https://github.com/microsoft/tsyringe/issues/221
 */
export function Inject(token: InjectionToken<unknown>) {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    tsyringeInject(token)(target, propertyKey ?? '', parameterIndex);
  };
}

/**
 * Re-export tsyringe decorator into Pascal Case
 */
 
export {
  injectable as Injectable,
  singleton as Singleton,
  autoInjectable as AutoInjectable,
  injectAll as InjectAll,
  injectWithTransform as InjectWithTransform,
  injectAllWithTransform as InjectAllWithTransform,
  scoped as Scoped,
  registry as Registry,
  delay as Delay,
} from 'tsyringe';
