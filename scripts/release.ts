import fs from 'node:fs/promises';
import path from 'node:path';
import { execa, Options as ExecaOptions } from 'execa';

async function execute(process: string, args: string[], option: ExecaOptions & { dryRun?: boolean }) {
  const dryRun = option.dryRun ?? false;
  if (dryRun) {
    console.log(`[dry-run] ${process} ${args.join(' ')}`);
    return;
  }
  return execa(process, args, option).then(result => {
    console.log(result.stdout);
    return result;
  });
}

export type ReleaseType = 'major' | 'minor' | 'patch' | 'alpha';

async function main() {
  const dryRun = process.env.DRY_RUN === 'true';
  const releaseType: ReleaseType = 'alpha'; // TODO: use @inquirer/prompts to select release type later
  console.log(`Starting release nammatham... ${dryRun ? 'with dry-run' : ''}`);
  const { version } = await readPackageJson(process.cwd());
  console.log(`Current version: ${version}`);

  const newVersion = await publishPackages({
    directory: path.resolve('packages'),
    dryRun,
    releaseType,
    version,
  });
  await modifyVersion(process.cwd(), newVersion);
  await execute('git', ['tag', '-a', `v${newVersion}`, '-m', `v${newVersion}`], { dryRun });
  await execute('git', ['push', 'origin', '--all'], { dryRun });
  await execute('git', ['push', 'origin', '--tags'], { dryRun });
}

export interface PublishPackagesOptions {
  version: string;
  releaseType: ReleaseType;
  directory: string;
  dryRun?: boolean;
}

async function publishPackages({ directory, dryRun, releaseType, version }: PublishPackagesOptions) {
  const newVersion = bumpVersion(version, { dryRun, releaseType });
  const packages = await fs.readdir(directory);
  for (const packageName of packages) {
    const packagePath = path.resolve(directory, packageName);
    const { name } = await readPackageJson(packagePath);
    await modifyVersion(packagePath, newVersion);
    console.log(`Publishing ${name}@${newVersion}`);
    await execute('npm', ['publish', '--access', 'public'], {
      cwd: packagePath,
      dryRun,
    });
  }
  return newVersion;
}

function bumpVersion(version: string, option: { dryRun?: boolean; releaseType: ReleaseType }) {
  const [mainVersion, alphaVersion] = version.split('-');
  const alpha = alphaVersion ? Number(alphaVersion.split('.')[1]) : 0;
  const [major, minor, patch] = mainVersion.split('.').map(Number);
  switch (option.releaseType) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'alpha':
      return `${major}.${minor}.${patch}-alpha.${alpha + 1}`;
  }
}

async function modifyVersion(packagePath: string, newVersion: string) {
  const packageJsonPath = path.resolve(packagePath, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
  packageJson.version = newVersion;
  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

async function readPackageJson(packagePath: string) {
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

main().catch(error => {
  console.error(error);
  process.exit(1);
});
