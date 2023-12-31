import fs from 'fs-extra';
import path from 'path';

export async function copyReadmeFromRoot(option: { directories: string[] }) {
  for (const directory of option.directories) {
    const packages = await fs.readdir(directory);
    for (const packageName of packages) {
      const packagePath = path.resolve(directory, packageName);
      fs.copyFile(path.resolve('README.md'), path.resolve(packagePath, 'README.md'));
    }
  }
}
