import type { BaseFunctionBinding } from '../';

export function isUseHelper(bindings: BaseFunctionBinding<unknown, string>[]): boolean {
  for (const binding of bindings) {
    if (binding.useHelper === undefined) {
      continue;
    }
    if (binding.useHelper === true) {
      return true;
    }
  }

  return false;
}
