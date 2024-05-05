import type { Options, ExecaChildProcess } from 'execa';

import debug from 'debug';
import { execa } from 'execa';

const filter = process.env.DEBUG_FILTER;
const DEBUG = process.env.DEBUG;

interface DebuggerOptions {
  onlyWhenFocused?: boolean | string;
}

export type DebugScope = `nammatham:${string}`;

/**
 * Ref: packages/vite/src/node/utils.ts
 */
export function createDebugger(
  namespace: DebugScope,
  options: DebuggerOptions = {}
): debug.Debugger['log'] | undefined {
  const log = debug(namespace);
  const { onlyWhenFocused } = options;

  let enabled = log.enabled;
  if (enabled && onlyWhenFocused) {
    const ns = typeof onlyWhenFocused === 'string' ? onlyWhenFocused : namespace;
    enabled = !!DEBUG?.includes(ns);
  }

  if (enabled) {
    return (...args: [string, ...any[]]) => {
      if (!filter || args.some(a => a?.includes?.(filter))) {
        log(...args);
      }
    };
  }
}

export interface ExecuteOptions {
  execaOptions?: Options;
  debug?: debug.Debugger['log'];
  dryRun?: boolean;
}

export function execute(
  file: string,
  args: readonly string[] = [],
  options?: ExecuteOptions
): ExecaChildProcess<string> | undefined {
  const dryRun = options?.dryRun ?? false;
  const command = [file, ...args].join(' ');
  options?.debug?.(`Running command: ${command}`);
  if (dryRun === false) {
    const proc = execa(file, args, {
      /**
       * Make sure to inherit the stdio so that the output is shown in the console
       * such as the console colors
       */
      stdio: 'inherit',
      ...options?.execaOptions,
    });
    return proc;
  }
}
