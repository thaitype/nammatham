import type { BuildOptions as EsbuildOptions } from 'esbuild';

export interface TargetBaseOptions {
  /**
   * The target architecture for the build.
   */
  arch: 'x64' | 'arm64';
  // /**
  //  * The target node.js or bun version.
  //  *
  //  * For node.js, only support version 18 due to minimum version of Nammatham Framework.
  //  */
  // runtime: 'bun' | 'node18';

  /**
   * @see https://bun.sh/docs/bundler/executables
   *
   * The build options for bun, On x64 platforms, Bun uses SIMD optimizations which require a modern CPU supporting AVX2 instructions.
   * The -baseline build of Bun is for older CPUs that don't support these optimizations.
   *
   * TODO: Support the options for bun later
   */
  // options?: 'baseline' | 'modern';
}

/**
 * Using only for bun cli
 * @see https://bun.sh/docs/bundler/executables
 */
export interface TargetBunOptions extends TargetBaseOptions {
  /**
   * The target platform for the build.
   */
  platform: 'linux' | 'windows' | 'darwin';
}

/**
 * Use for nammatham config options, and pkg build options
 */

export interface TargetOptions extends TargetBaseOptions {
  /**
   * The target platform for the build.
   */
  platform: 'linux' | 'win' | 'macos';
}

export interface BuildOptions {
  /**
   * Disable the build process. This is useful when you want to disable the build process for a specific environment.
   * You need to manage the build process manually, however, the other Azure Functions configurations will be managed by the framework.
   * For example, `function.json`, `local.settings.json`, and `host.json` will be managed by the framework.
   * 
   * @default false
   */
  disabled?: boolean;
  /**
   * The entry file for the build. If not specified, it will use the main file from the package.json.
   */
  entryFile?: string;
  /**
   * Specify the target for the build.
   *
   * If not specified, it will build for the host platform.
   * Accept the following values:
   * - `host`: Build for the host platform.
   * - An object that specifies the target platform, architecture, and runtime.
   */
  target?: TargetOptions;
  /**
   * esbuild options, using for build and bundle the code, especially for Node.js runtime.
   */
  esbuildOptions?: EsbuildOptions;
  /**
   * Node.js toolchain options, using for build and package the code.
   *
   * @default { dev: 'tsx', bundle: 'esbuild', package: 'pkg' }
   */
  nodeToolChain?: {
    /**
     * The development tool to use for the Node.js runtime.
     * `tsx` support watch mode for TypeScript.
     */
    dev?: 'tsx';
    /**
     * The bundler tool to bundle the code, before package the code into a single executable file.
     */
    bundle?: 'esbuild';
    /**
     * The package tool to package the code into a single executable file.
     * `pkg` internally used for build the executable file. the `pkg` package is marked as deprecated.
     *
     * TODO: Support node.js [Single executable applications](https://nodejs.org/api/single-executable-applications.html) method
     *
     * @default 'pkg'
     */
    package?: 'pkg';
    /**
     * For node.js, only support version 18 due to minimum version of Nammatham Framework.
     * However, `pkg` version 5.8.1 only support node.js version 18.x and below.
     */
    version?: 18;
  };
}
