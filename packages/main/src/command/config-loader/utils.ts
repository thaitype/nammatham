import path from 'node:path';

import { findNearestPackageData } from '../packages';

export function isFilePathESM(filePath: string): boolean {
  if (/\.m[jt]s$/.test(filePath)) {
    return true;
  } else if (/\.c[jt]s$/.test(filePath)) {
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
