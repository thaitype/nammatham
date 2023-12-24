import type { InvocationContext } from '@azure/functions';

export class NammathamContext {
  constructor(public readonly context: InvocationContext) {}
  /**
   * The recommended way to log information data (level 2) during invocation.
   * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
   */
  public log(...args: any[]) {
    this.context.log(...args);
  }

}
