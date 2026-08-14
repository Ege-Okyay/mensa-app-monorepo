import { CRON_JOBS } from './config';
import { dispatchWorkflow, type Env } from './dispatch';

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      (async () => {
        try {
          const job = CRON_JOBS.find((j) => j.cron === event.cron);

          if (!job) {
            console.warn(`[cron] unhandled schedule: ${event.cron}`);
            return;
          }
          
          for (const workflow of job.workflows) {
            try {
              await dispatchWorkflow(env, workflow);
              
              console.log(`[cron] ${event.cron} -> ${workflow} ok`);
            } catch (err) {
              console.error(`[cron] ${event.cron} -> ${workflow} failed:`, err);
            }
          }
        } catch (err) {
          console.error(`[cron] ${event.cron} handler error:`, err);
        }
      })(),
    );
  }
};
