import { createInfraConfig } from './utils';

export const infraConfigs = createInfraConfig(
  {
    'node18-linux-x64': process.env.RESOURCE_IDENTIFIER_NODE18_LINUX_X64,
    'node18-win-x64': process.env.RESOURCE_IDENTIFIER_NODE18_WIN_X64,
    'bun-linux-x64': process.env.RESOURCE_IDENTIFIER_BUN_LINUX_X64,
  },
  [
    // --- Node 18 ---
    {
      platform: 'linux',
      arch: 'x64',
      runtime: 'node',
      version: 18,
      isDeployable: true,
    },
    {
      platform: 'win',
      arch: 'x64',
      runtime: 'node',
      version: 18,
      isDeployable: true,
    },
    {
      platform: 'macos',
      arch: 'arm64',
      runtime: 'node',
      version: 18,
    },
    // --- Bun ----
    {
      platform: 'linux',
      arch: 'x64',
      runtime: 'bun',
      mode: 'create',
      isDeployable: true,
    },
    // {
    //   platform: 'win',
    //   arch: 'x64',
    //   runtime: 'bun',
    //   mode: 'create',
    //   isDeployable: true,
    // },
    // {
    //   platform: 'macos',
    //   arch: 'x64',
    //   runtime: 'bun',
    //   isDeployable: false,
    // },
  ]
);
