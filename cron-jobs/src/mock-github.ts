Bun.serve({
  port: 4000,
  async fetch(req) {
    const url = new URL(req.url);
    const body = await req.text();

    console.log(`[mock-github] ${req.method} ${url.pathname}`);
    console.log(`[mock-github] body: ${body}`);

    return new Response(null, { status: 204 });
  }
});
