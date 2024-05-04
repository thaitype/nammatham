import fs from 'node:fs';
import debug from 'debug';
import path from 'node:path';

import { findNearestPackageData } from './packages';

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

export function isFilePathESM(filePath: string): boolean {
  if (/\.m[jt]s$/.test(filePath)) {
    console.log('isFilePathESM', true);
    return true;
  } else if (/\.c[jt]s$/.test(filePath)) {
    console.log('isFilePathESM', false);
    return false;
  } else {
    // check package.json for type: "module"
    try {
      const pkg = findNearestPackageData(path.dirname(filePath));
      return pkg?.data.type === 'module';
    } catch {
      return false;
    }
  }
}

/**
 * From Vite
 */
export function tryStatSync(file: string): fs.Stats | undefined {
  try {
    // The "throwIfNoEntry" is a performance optimization for cases where the file does not exist
    return fs.statSync(file, { throwIfNoEntry: false });
  } catch {
    // Ignore errors
  }
}

// // Supported by Node, Deno, Bun
// const NODE_BUILTIN_NAMESPACE = 'node:';
// // Supported by Deno
// const NPM_BUILTIN_NAMESPACE = 'npm:';
// // Supported by Bun
// const BUN_BUILTIN_NAMESPACE = 'bun:';
// // Some runtimes like Bun injects namespaced modules here, which is not a node builtin
// const nodeBuiltins = builtinModules.filter(id => !id.includes(':'));

// // TODO: Use `isBuiltin` from `node:module`, but Deno doesn't support it
// export function isBuiltin(id: string): boolean {
//   if (process.versions.deno && id.startsWith(NPM_BUILTIN_NAMESPACE)) return true;
//   if (process.versions.bun && id.startsWith(BUN_BUILTIN_NAMESPACE)) return true;
//   return isNodeBuiltin(id);
// }

// export function isNodeBuiltin(id: string): boolean {
//   if (id.startsWith(NODE_BUILTIN_NAMESPACE)) return true;
//   return nodeBuiltins.includes(id);
// }
