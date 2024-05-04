import { loadConfigFromFile } from './command';

export interface NammathamCommandOptions {
  /**
   * The path to the build directory.
   * Add this path into .gitignore file, this will help to avoid the unnecessary files to be pushed to the repository.
   *
   * @default '.nmt'
   */
  buildPath?: string;
}

(async () => {
  console.log(`Start the command`);
  console.log(`PWD: ${process.cwd()}`);

  const userConfig = await loadConfigFromFile();
  console.log('userConfig', userConfig);

  console.log(`End the command`);
})();
