import { modifyAllDependencies } from './libs';

async function main() {
  await modifyAllDependencies('workspace:*', { directories: ['examples', 'packages'] });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
