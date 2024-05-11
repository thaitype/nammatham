import { build } from './build';
import { writeConfig } from './dev';
import { createDebugger } from './utils';
import { loadEnvVariables } from './config';
import { loadConfigFromFile } from './config-loader';
import { startAzureFunctionHost } from './azure-func-host';

const debug = createDebugger('nammatham:cli');

export async function main() {
  debug?.(`Working Directory: ${process.cwd()}`);

  /**
   * Remove the first two arguments which are the node binary and the script file
   *
   * TODO: Use a library like yargs or commander to parse the arguments
   */
  const args = process.argv.slice(2);
  console.log(`Args: ${args}`);
  if (args.length === 0) {
    console.error(`Please add command arguments`);
    process.exit(0);
  }
  const config = await loadConfigFromFile();
  debug?.(`Loaded config: ${JSON.stringify(config)}`);
  const envVars = loadEnvVariables(config?.envVariablesConfig);
  debug?.(`Loaded env variables: ${JSON.stringify(envVars)}`);

  // debug?.(`Command: ${args[0]}`);
  if (args[0] === 'dev') {
    debug?.(`Starting dev server`);
    await writeConfig(config, envVars);
    debug?.(`Config written`);
    await startAzureFunctionHost(config);
  } else if (args[0] === 'build') {
    await build(config);
  }
}
