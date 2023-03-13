import * as type from '@azure/functions';

export type InvocationContext = type.InvocationContext;
/**
 * Logger Type from InvocationContext
 */

export type Logger = {
  /**
   * The recommended way to log data during invocation.
   * Similar to Node.js's `console.log`, but has integration with Azure features like application insights
   * Uses the 'information' log level
   */
  log: type.InvocationContext['log'];
  /**
   * The recommended way to log trace data (level 0) during invocation.
   * Similar to Node.js's `console.trace`, but has integration with Azure features like application insights
   */
  trace: type.InvocationContext['trace'];
  /**
   * The recommended way to log debug data (level 1) during invocation.
   * Similar to Node.js's `console.debug`, but has integration with Azure features like application insights
   */
  debug: type.InvocationContext['debug'];
  /**
   * The recommended way to log information data (level 2) during invocation.
   * Similar to Node.js's `console.info`, but has integration with Azure features like application insights
   */
  info: type.InvocationContext['info'];
  /**
   * The recommended way to log warning data (level 3) during invocation.
   * Similar to Node.js's `console.warn`, but has integration with Azure features like application insights
   */
  warn: type.InvocationContext['warn'];
  /**
   * The recommended way to log error data (level 4) during invocation.
   * Similar to Node.js's `console.error`, but has integration with Azure features like application insights
   */
  error: type.InvocationContext['error'];
};

