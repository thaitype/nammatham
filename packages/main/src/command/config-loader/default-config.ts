import type { NammathamConfigs } from '../nammatham-config';

export function provideDefaultConfig(userConfig: NammathamConfigs = {}): NammathamConfigs {
  userConfig.buildPath = userConfig.buildPath ?? '.nmt';
  return userConfig;
}
