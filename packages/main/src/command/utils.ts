import debug from 'debug';

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
