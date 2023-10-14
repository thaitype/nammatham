import { getExtraInputGetterFunc, getExtraOutputSetterFunc } from './helpers';
import type { InferInput, InferOutput, InputCollection, OutputCollection } from './types';
import type { InvocationContext } from '@azure/functions';

export class NammathamContext<TInput extends InputCollection, TOutput extends OutputCollection> {
  constructor(public readonly context: InvocationContext, protected _inputs: TInput, protected _outputs: TOutput) {}
  /**
   * The recommended way to log information data (level 2) during invocation.
   * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
   */
  public log(...args: any[]) {
    this.context.log(...args);
  }

  protected getAllOutputsFunc() {
    const result = Object.entries(this._outputs).reduce((acc, [name, value]) => {
      acc[name] = getExtraOutputSetterFunc(this.context, name);
      return acc;
    }, {} as Record<string, unknown>);
    return result as InferOutput<TOutput>;
  }

  protected getAllInputsFunc() {
    const result = Object.entries(this._inputs).reduce((acc, [name, value]) => {
      acc[name] = getExtraInputGetterFunc(this.context, name);
      return acc;
    }, {} as Record<string, unknown>);
    return result as InferInput<TInput>;
  }

  extraOutputs = this.getAllOutputsFunc();
  extraInputs = this.getAllInputsFunc();
}
