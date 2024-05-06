import { build } from './build';
import { createDebugger } from './utils';
import { loadConfigFromFile } from './config-loader';
import { loadEnvVariables, writeConfig } from './config';
import { startAzureFunctionHost } from './azure-func-host';

const debug = createDebugger('nammatham:cli');

export async function main() {
  console.log(`Start the command`);
  debug?.(`Working Directory: ${process.cwd()}`);

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
  debug?.(`Loaded config: ${JSON.stringify(config)}`);
  const envVars = loadEnvVariables(config?.envVariablesConfig);
  debug?.(`Loaded env variables: ${JSON.stringify(envVars)}`);

  if (args[0] === 'dev') {
    await writeConfig(config, envVars);
    /**
     * setup host.json for dev
 
      "watchDirectories": [
          "../src", // Watch the source directory
          "." // watch the function.json
        ]

      "defaultExecutablePath": "../node_modules/.bin/tsx",
      "arguments": [
        "watch",
        "../src/main.ts"
      ]
     */
    await startAzureFunctionHost(config);
  } else if (args[0] === 'build') {
    console.log(`Build the code`);
    await build(config);
  }
  console.log(`End the command`);
}
