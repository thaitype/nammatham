import type { NammathamCommandOptions } from '../cli';

export interface NammathamConfigs extends NammathamCommandOptions {
  some?: string;
}

/**
 * Type helper to make it easier to use nammatham.config.ts
 * accepts a direct {@link NammathamConfigs} object
 */
export function defineConfig(config: NammathamConfigs) {
  console.log(`Config: ${config}`);
  return config;
}

/**
 * packages/vite/src/node/config.ts
 * @param file
 */

// export async function loadConfigFromFile(file?: string, configRoot = process.cwd()){
//   let resolvedPath: string | undefined;

//   if (file) {
//     const resolvedPath = path.resolve(file);
//   } else {
//     for (const filename of DEFAULT_CONFIG_FILES) {
//       const filePath = path.resolve(configRoot, filename);
//       if (!fs.existsSync(filePath)) continue;

//       resolvedPath = filePath;
//       break;
//     }
//   }

//   if (!resolvedPath) {
//     // throw new Error(`Cannot find config file in ${configRoot}`);
//     return null;
//   }

//   // const userConfig = await loadConfigFromFile(
//   //   resolvedPath,
//   //   bundled.code,
//   //   isESM,
//   // )

// }
