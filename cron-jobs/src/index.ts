interface Env {
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_REF: string;
  GITHUB_API_BASE: string;
  DRY_RUN: boolean;
}

async function dispatchWorkflow(env: Env, workflowID: string): Promise<void> {
  const url = `${env.GITHUB_API_BASE}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/workflows/${workflowID}/dispatches`;
  const body = JSON.stringify({ ref: env.GITHUB_REF });

  const dryRun = String(env.DRY_RUN) === "true";
  console.log(`[dry-run]: ${dryRun ? 'ACTIVE' : 'DISABLED'}`);

  if (dryRun) {
    console.log(`[dry-run] POST ${url}`);
    console.log(`[dry-run] body: ${body}`);
    return;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "User-Agent": "mensa-today-cron",
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2026-03-10",
    },
    body
  });

  if (!res.ok) throw new Error(`${workflowID}: ${res.status} ${await res.text()}`);

  console.log(`dispatched ${workflowID}`);
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(
      (async () => {
        switch (event.cron) {
        case "0 15 * * *":
          console.log("HELLO");
          await dispatchWorkflow(env, "test-dispatch.yml");
          break;
        default:
          console.warn(`unhandled cron: ${event.cron}`);
        }
      })(),
    );
  }
};
