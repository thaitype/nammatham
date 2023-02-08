import path from 'path';
/**
 *
 * Example:
 *  - cwd = '/home/nammatham/examples/crud'
 *  - absolutePath = '/home/nammatham/examples/crud/src/main.ts'
 *
 * Return:
 *  - 'src/'
 *
 * @param cwd Working Directory
 * @param absolutePath Absolute Path file
 * @returns
 */

export function extractRelativeWorkingDirectory(cwd: string, absolutePath: string) {
  return path.dirname(absolutePath).replace(cwd, '');
}

export function removeExtension(filename: string) {
  return filename.substring(0, filename.lastIndexOf('.'));
}
