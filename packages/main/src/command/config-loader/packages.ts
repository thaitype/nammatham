import fs from 'fs';
import path from 'path';

import { tryStatSync } from './utils';

export interface PackageData {
  data: {
    [field: string]: any;
    name: string;
    type: string;
    version: string;
    main: string;
    module: string;
    browser: string | Record<string, string | false>;
    exports: string | Record<string, any> | string[];
    imports: Record<string, any>;
    dependencies: Record<string, string>;
  };
}

/**
 * From Vite
 */

export function findNearestPackageData(basedir: string): PackageData | null {
  while (basedir) {
    const pkgPath = path.join(basedir, 'package.json');
    if (tryStatSync(pkgPath)?.isFile()) {
      try {
        const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return { data: pkgData };
      } catch {
        // ignore
      }
    }

    const nextBasedir = path.dirname(basedir);
    if (nextBasedir === basedir) break;
    basedir = nextBasedir;
  }

  return null;
}
