import { loadConfigFromFile } from './config-loader';
import { loadEnvVariables, writeConfig } from './config';

export async function main() {
  console.log(`Start the command`);
  console.log(`PWD: ${process.cwd()}`);

  const config = await loadConfigFromFile();
  const envVars = loadEnvVariables(config?.envVariablesConfig);
  await writeConfig(config, envVars);

  console.log(`End the command`);
}
