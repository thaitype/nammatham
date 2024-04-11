import { func } from '../nammatham';

export default func
  .timer('watcher', {
    schedule: '*/5 * * * * *',
  })
  .handler(async ({ trigger, context }) => {
    context.info('Timer triggered!');
    trigger.isPastDue ? context.info('Timer is past due!') : null;
  });
