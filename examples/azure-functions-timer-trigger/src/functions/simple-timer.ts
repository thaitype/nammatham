import { func } from '../nammatham';

export default func
  .timer('watcher', {
    schedule: '*/5 * * * * *',
  })
  .handler(async (timer, ctx) => {
    ctx.context.info('Timer triggered!'); 
    timer.isPastDue ? ctx.context.info('Timer is past due!') : null;
  });
