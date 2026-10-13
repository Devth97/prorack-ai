// Mints a short-lived, single-use Bolna web-call session for the browser.
// The Bolna API key (bn-…) stays server-side; the browser only ever receives
// ephemeral credentials that expire in ~120s and are consumed by one call.
// Required env vars: BOLNA_API_KEY, BOLNA_AGENT_ID.

const BOLNA_MINT_URL = 'https://api.bolna.ai/web-call/session';

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export async function mintBolnaSession(req, env = process.env) {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  // Only allow the session to be minted from our own pages, so other sites
  // can't embed the agent and spend our call minutes.
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(req.url).host) {
    return json(403, { error: 'Forbidden' });
  }

  const apiKey = env.BOLNA_API_KEY;
  const agentId = env.BOLNA_AGENT_ID;
  if (!apiKey || !agentId) return json(500, { error: 'Voice agent is not configured' });

  // Forward only known, harmless context to the agent prompt ({{page}}).
  const body = await req.json().catch(() => ({}));
  const page = String(body?.user_data?.page || '').slice(0, 120);

  const r = await fetch(BOLNA_MINT_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent_id: agentId, user_data: { page } }),
  });
  return new Response(await r.text(), {
    status: r.status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export default (req) => mintBolnaSession(req);

export const config = { path: '/api/bolna-session' };
