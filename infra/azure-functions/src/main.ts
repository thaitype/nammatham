import { toTarget } from './utils';
import { infraConfigs } from './config';
import { createFunctionApp, destroyFunctionApp } from './azure-command';

const isPlanMode = process.env.PLAN_MODE === 'true';

console.log(`Running in plan mode: ${isPlanMode}`);

console.table(infraConfigs);

for (const infraConfig of infraConfigs) {
  if (!infraConfig.mode) {
    console.log(`Skipping infra config with target ${toTarget(infraConfig)}`);
    continue;
  }
  if (infraConfig.mode === 'create') {
    await createFunctionApp(infraConfig, { isPlanMode });
  } else if (infraConfig.mode === 'destroy') {
    await destroyFunctionApp(infraConfig, { isPlanMode });
  } else {
    console.log(
      `mode=${infraConfig.mode} is not supported yet, Skipping infra config with target ${toTarget(infraConfig)}`
    );
  }
}
