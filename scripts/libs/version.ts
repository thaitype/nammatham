import path from 'node:path';
import fs from 'node:fs/promises';

export async function modifyVersion(packagePath: string, newVersion: string) {
  const packageJsonPath = path.resolve(packagePath, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
  packageJson.version = newVersion;
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

export async function modifyPackagesVersion(option: { version: string; directories: string[] }) {
  const { version } = option;
  for (const directory of option.directories) {
    const packages = await fs.readdir(directory);
    for (const packageName of packages) {
      const packagePath = path.resolve(directory, packageName);
      await modifyVersion(packagePath, version);
    }
  }
}

export async function modifyAllDependencies(newVersion: string, option: { directories: string[] }) {
  const { directories } = option;
  for (const directory of directories) {
    // In directory, there sub directories which have package.json
    const packages = await fs.readdir(directory);
    for (const packageName of packages) {
      const packagePath = path.resolve(directory, packageName);
      await modifyDependency(packagePath, newVersion);
    }
  }
}

async function modifyDependency(packagePath: string, newVersion: string) {
  const packageJsonPath = path.resolve(packagePath, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
  const { dependencies } = packageJson;

  // Replaces all @nammatham/* dependencies
  for (const [name, version] of Object.entries(dependencies ?? {})) {
    if (name.startsWith('@nammatham/' || name === 'nammatham')) {
      dependencies[name] = newVersion;
    }
  }
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}


export async function readPackageJson(packagePath: string) {
  const packageJsonPath = path.resolve(packagePath, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
  if (!('name' in packageJson && 'version' in packageJson)) {
    throw new Error(`Invalid package.json: ${packageJsonPath}`);
  }
  return packageJson as {
    name: string;
    version: string;
  };
}
