import type { InvocationContext } from '@azure/functions';

export function getExtraInputGetterFunc<TReturn = unknown>(context: InvocationContext, name: string) {
  return { get: () => context.extraInputs.get(name) as TReturn };
}

export function getExtraOutputSetterFunc<TValue = unknown>(context: InvocationContext, name: string) {
  return { set: (value: TValue) => context.extraOutputs.set(name, value) };
}
