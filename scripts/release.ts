import fs from 'node:fs/promises';
import path from 'node:path';
import { copyReadmeFromRoot, execute, modifyAllDependencies, modifyPackagesVersion, modifyVersion, readPackageJson } from './libs';

export type ReleaseType = 'major' | 'minor' | 'patch' | 'alpha';

async function main() {
  const dryRun = process.env.DRY_RUN === 'true';
  const releaseType: ReleaseType = 'alpha'; // TODO: use @inquirer/prompts to select release type later
  console.log(`Starting release nammatham... ${dryRun ? 'with dry-run' : ''}`);
  const { version } = await readPackageJson(process.cwd());
  console.log(`Current version: ${version}`);

  const newVersion = bumpVersion(version, { dryRun, releaseType });
  await modifyAllDependencies(newVersion, { directories: ['examples', 'packages'] });
  await modifyVersion(process.cwd(), newVersion);
  await modifyPackagesVersion({ version: newVersion, directories: [path.resolve('packages')] });
  await copyReadmeFromRoot({ directories: ['packages'] });
  await execute('git', ['add', '.'], { dryRun });
  await execute('git', ['commit', '-m', `Bump version v${newVersion}`], { dryRun });
  await publishPackages({
    directory: path.resolve('packages'),
    dryRun,
    version: newVersion,
  });
  await execute('git', ['tag', '-a', `v${newVersion}`, '-m', `v${newVersion}`], { dryRun });
  await execute('git', ['push', 'origin', '--all'], { dryRun });
  await execute('git', ['push', 'origin', '--tags'], { dryRun });
}

export interface PublishPackagesOptions {
  version: string;
  directory: string;
  dryRun?: boolean;
}

async function publishPackages({ directory, dryRun, version }: PublishPackagesOptions) {
  const packages = await fs.readdir(directory);
  for (const packageName of packages) {
    const packagePath = path.resolve(directory, packageName);
    const { name } = await readPackageJson(packagePath);
    console.log(`Publishing ${name}@${version}`);
    await execute('npm', ['publish', '--access', 'public'], {
      cwd: packagePath,
      dryRun,
    });
  }
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

main().catch(error => {
  console.error(error);
  process.exit(1);
});
