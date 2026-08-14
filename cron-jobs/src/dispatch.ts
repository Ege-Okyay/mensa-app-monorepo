export interface Env {
  GITHUB_TOKEN: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_REF: string;
  GITHUB_API_BASE: string;
  DRY_RUN: boolean;
}

export function buildDispatchUrl(apiBase: string, owner: string, repo: string, workflowID: string): string {
  return `${apiBase}/repos/${owner}/${repo}/actions/workflows/${workflowID}/dispatches`;
}

export function buildDispatchBody(ref: string): string {
  return JSON.stringify({ ref });
}

export async function dispatchWorkflow(env: Env, workflowID: string): Promise<void> {
  const url = buildDispatchUrl(env.GITHUB_API_BASE, env.GITHUB_OWNER, env.GITHUB_REPO, workflowID);
  const body = buildDispatchBody(env.GITHUB_REF);

  if (String(env.DRY_RUN) === 'true') {
    console.log(`[dry-run] POST ${url}`);
    console.log(`[dry-run] body: ${body}`);
    return;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'mensa-today-cron',
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2026-03-10',
    },
    body
  });

  if (!res.ok) throw new Error(`${workflowID}: ${res.status} ${await res.text()}`);

  console.log(`dispatched ${workflowID}`);
}
