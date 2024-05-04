import path from 'node:path';

import { simpleLoadConfig } from './command';
import fs from 'node:fs';
import { BuildOptions, build } from 'esbuild';

export interface NammathamCommandOptions {
  /**
   * The path to the build directory.
   * Add this path into .gitignore file, this will help to avoid the unnecessary files to be pushed to the repository.
   *
   * @default '.nmt'
   */
  buildPath?: string;
}

const config: NammathamCommandOptions = {
  buildPath: '.nmt/tmp',
};

(async () => {
  console.log(`Start the command`);
  console.log(`PWD: ${process.cwd()}`);

  // const userConfig = await loadConfigFromFile();
  // const userConfig = await simpleLoadConfig(path.resolve(process.cwd(), 'nammatham.config.ts'));
  // console.log('userConfig', userConfig);


  await fs.promises.mkdir(path.resolve(config.buildPath ?? '') ?? '', { recursive: true });
  const outfile = path.resolve(config.buildPath ?? '', 'nammatham.config.mjs');

  await build({
    entryPoints: [path.resolve('nammatham.config.ts')],
    bundle: true,
    outfile,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    sourcemap: false,
  } as BuildOptions);

  try {
    const option = (await import(outfile)).default;
    console.log(option);
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    // fs.unlink(outfile, () => {}); // ignore the error
  }


  console.log(`End the command`);
})();
