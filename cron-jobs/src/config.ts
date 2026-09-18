export interface CronJob {
  cron: string;
  workflows: string[];
}

export const CRON_JOBS: CronJob[] = [
  {
    cron: '0,20,40 11 * * *',
    workflows: ['scrape.yml']
  },
  {
    cron: '0,20 12 * * *',
    workflows: ['scrape.yml'],
  },
  {
    cron: '30,50 17 * * *',
    workflows: ['scrape.yml'],
  },
  {
    cron: '10 18 * * *',
    workflows: ['scrape.yml'],
  },
  {
    cron: '0 15 * * *',
    workflows: ['clear-menus.yml']
  },
  {
    cron: '0 22 * * *',
    workflows: ['clear-menus.yml']
  }
];
