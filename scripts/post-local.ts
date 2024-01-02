import { modifyAllDependencies, readPackageJson } from './libs';

async function main() {
  const { version } = await readPackageJson(process.cwd());
  console.log(`Current version: ${version}`);
  await modifyAllDependencies(version, { directories: ['examples', 'packages'] });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
