import { build } from './build';
import { loadConfigFromFile } from './config-loader';
import { loadEnvVariables, writeConfig } from './config';
import { startAzureFunctionHost } from './azure-func-host';

export async function main() {
  console.log(`Start the command`);
  console.log(`PWD: ${process.cwd()}`);

  /**
   * Remove the first two arguments which are the node binary and the script file
   */
  const args = process.argv.slice(2);
  console.log(`Args: ${args}`);
  if (args.length === 0) {
    console.error(`Please add command arguments`);
    process.exit(0);
  }
  const config = await loadConfigFromFile();
  const envVars = loadEnvVariables(config?.envVariablesConfig);

  if (args[0] === 'dev') {
    await writeConfig(config, envVars);
    await startAzureFunctionHost(config);
  } else if (args[0] === 'build') {
    console.log(`Build the code`);
    await build(config);
  }
  console.log(`End the command`);
}