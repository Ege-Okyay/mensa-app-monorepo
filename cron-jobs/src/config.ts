export interface CronJob {
  cron: string;
  workflows: string[];
}

export const CRON_JOBS: CronJob[] = [
  {
    cron: '0,20,40 9 * * *',
    workflows: ['scrape.yml']
  },
  {
    cron: '0,20 10 * * *',
    workflows: ['scrape.yml'],
  },
  {
    cron: '30,50 15 * * *',
    workflows: ['scrape.yml'],
  },
  {
    cron: '10 16 * * *',
    workflows: ['scrape.yml'],
  },
  {
    cron: '0 13 * * *',
    workflows: ['clear-menus.yml']
  },
];
