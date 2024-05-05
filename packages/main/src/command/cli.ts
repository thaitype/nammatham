import { loadConfigFromFile } from './config-loader';

export async function main() {
  console.log(`Start the command`);
  console.log(`PWD: ${process.cwd()}`);

  const userConfig = await loadConfigFromFile();
  console.log('parse config', userConfig);

  console.log(`End the command`);
}
