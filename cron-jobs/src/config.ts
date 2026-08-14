export interface CronJob {
  cron: string;
  workflows: string[];
}

export const CRON_JOBS: CronJob[] = [
  {
    cron: '0 15 * * *',
    workflows: ['test-dispatch.yml']
  }
];
