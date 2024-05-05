import type { NammathamConfigs } from '../config-loader';

import { createDebugger, execute } from '../utils';

const debug = createDebugger('nammatham:func-host');

export async function startAzureFunctionHost(config: NammathamConfigs) {
  debug?.('Starting Azure Function Host');

  await execute('func', ['start'], {
    debug,
    execaOptions: {
      cwd: config.buildPath ?? process.cwd(),
    },
  });

  debug?.('Azure Function Host started');
}
