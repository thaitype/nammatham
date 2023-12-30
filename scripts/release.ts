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

async function main() {
  const dryRun = process.env.DRY_RUN === 'true';
  console.log(`Starting release nammatham... ${dryRun ? 'with dry-run' : ''}`);
  const { version } = await readPackageJson(process.cwd());
  console.log(`Current version: ${version}`);

  await execute('git', ['tag', '-a', `v${version}`, '-m', `v${version}`], { dryRun });
  await publishPackages({
    directory: path.resolve('packages'),
    dryRun,
  });
  await execute('git', ['push', 'origin', '--all'], { dryRun });
  await execute('git', ['push', 'origin', '--tags'], { dryRun });
}

async function publishPackages({ directory, dryRun }: { directory: string; dryRun: boolean }) {
  const packages = await fs.readdir(directory);
  for (const packageName of packages) {
    const packagePath = path.resolve(directory, packageName);
    const { name, version } = await readPackageJson(packagePath);
    console.log(`Publishing ${name}@${version}`);
    await execute('npm', ['publish', '--access', 'public'], {
      cwd: packagePath,
      dryRun,
    });
  }
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
