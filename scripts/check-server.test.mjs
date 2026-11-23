import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createProductionServer } from '../server-app.mjs';

let directory, server, port;
const env = { BOLNA_API_KEY: 'test-private-key', BOLNA_AGENT_ID: 'test-agent' };
before(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'prorack-server-'));
  const rootDir = path.join(directory, 'dist');
  await mkdir(path.join(rootDir, 'assets'), { recursive: true });
  await writeFile(path.join(rootDir, 'index.html'), '<h1>ProRack</h1>');
  await writeFile(path.join(rootDir, 'company.html'), '<h1>Company</h1>');
  await writeFile(path.join(rootDir, '404.html'), '<h1>Page not found</h1>');
  await writeFile(path.join(rootDir, 'favicon.ico'), 'icon');
  await writeFile(path.join(rootDir, 'llms-full.txt'), 'ProRack full text');
  await writeFile(path.join(rootDir, 'assets', 'photo.jpg'), 'image fixture');
  await writeFile(path.join(directory, '.env'), 'PRIVATE=secret');
  await writeFile(path.join(rootDir, '.env'), 'PRIVATE=secret');
  server = createProductionServer({ rootDir, env });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  port = server.address().port;
});
after(async () => {
  await new Promise(resolve => server.close(resolve));
  await rm(directory, { recursive: true, force: true });
});
function request(url, { method = 'GET', body, origin, host } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: url, method,
      headers: { ...(host ? { Host: host } : {}), ...(origin ? { Origin: origin } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) } }, res => {
      let text = ''; res.setEncoding('utf8'); res.on('data', chunk => text += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, text }));
    });
    req.on('error', reject); req.end(body);
  });
}
test('serves built pages and assets, including HEAD requests', async () => {
  assert.equal((await request('/')).text, '<h1>ProRack</h1>');
  assert.equal((await request('/company.html')).status, 200);
  assert.equal((await request('/favicon.ico')).status, 200);
  assert.equal((await request('/llms-full.txt')).status, 200);
  assert.equal((await request('/assets/photo.jpg?v=123')).headers['content-type'], 'image/jpeg');
  assert.equal((await request('/company.html', { method: 'HEAD' })).text, '');
});
test('consolidates duplicate URLs on one canonical address with 301 redirects', async () => {
  const cases = [['/company', '/company.html'], ['/company/', '/company.html'], ['/index.html', '/'], ['/company?ref=x', '/company.html?ref=x']];
  for (const [from, to] of cases) {
    const response = await request(from);
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.location, to, from);
  }
  const www = await request('/company.html?a=1', { host: 'www.prorack.ai' });
  assert.equal(www.status, 301);
  assert.equal(www.headers.location, 'https://prorack.ai/company.html?a=1');
});
test('sends the modern security header baseline and keeps the microphone for RackBot', async () => {
  const { headers } = await request('/company.html');
  assert.match(headers['content-security-policy'], /frame-ancestors 'none'/);
  assert.equal(headers['cross-origin-opener-policy'], 'same-origin-allow-popups');
  assert.match(headers['permissions-policy'], /microphone=\(self\)/);
  assert.match(headers['permissions-policy'], /camera=\(\)/);
});
test('unknown pages return a real HTML 404 that is not indexed', async () => {
  const response = await request('/no-such-page');
  assert.equal(response.status, 404);
  assert.match(response.headers['content-type'], /^text\/html/);
  assert.equal(response.headers['x-robots-tag'], 'noindex');
  assert.equal((await request('/404.html')).status, 404);
});
test('does not expose environment files or paths outside the publish directory', async () => {
  for (const url of ['/.env', '/%2eenv', '/assets/../../.env', '/assets/%2e%2e/%2e%2e/.env', '/package.json', '/netlify/functions/bolna-session.mjs']) {
    assert.equal((await request(url)).status, 404, url);
  }
});
test('the production session route exists and rejects GET with JSON', async () => {
  const response = await request('/api/bolna-session');
  assert.equal(response.status, 405);
  assert.equal(JSON.parse(response.text).error, 'Method not allowed');
  assert.equal(response.headers['cache-control'], 'no-store');
});
test('blocks requests from another website', async () => {
  assert.equal((await request('/api/bolna-session', { method: 'POST', origin: 'https://other.test', body: '{}' })).status, 403);
});
test('mints a session using runtime secrets and forwards only the page context', async t => {
  let outbound;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    outbound = { url, ...options };
    return Response.json({ session_id: 'single-use-session', token: 'ephemeral-token' });
  });
  const response = await request('/api/bolna-session', { method: 'POST', origin: `http://127.0.0.1:${port}`,
    body: JSON.stringify({ agent_id: 'untrusted-agent', user_data: { page: 'Company', secret: 'ignored' } }) });
  assert.equal(response.status, 200);
  assert.equal(JSON.parse(response.text).session_id, 'single-use-session');
  assert.equal(outbound.url, 'https://api.bolna.ai/web-call/session');
  assert.equal(outbound.headers.Authorization, 'Bearer test-private-key');
  assert.deepEqual(JSON.parse(outbound.body), { agent_id: 'test-agent', user_data: { page: 'Company' } });
  assert.ok(!response.text.includes(env.BOLNA_API_KEY));
});
test('returns JSON without crashing when the voice provider is unavailable', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('private upstream detail'); });
  const response = await request('/api/bolna-session', { method: 'POST', body: '{}' });
  assert.equal(response.status, 502);
  assert.ok(JSON.parse(response.text).error);
  assert.ok(!response.text.includes('private upstream detail'));
  assert.equal((await request('/')).status, 200);
});
test('keeps video byte-range playback working', async () => {
  await writeFile(path.join(directory, 'dist', 'assets', 'clip.mp4'), '0123456789');
  const response = await new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port, path: '/assets/clip.mp4', headers: { Range: 'bytes=2-5' } }, res => {
      let text=''; res.on('data', chunk=>text+=chunk); res.on('end', ()=>resolve({ status:res.statusCode, range:res.headers['content-range'], text }));
    }).on('error', reject);
  });
  assert.deepEqual(response, { status:206, range:'bytes 2-5/10', text:'2345' });
});
test('reports missing runtime configuration as JSON, not a missing route', async () => {
  const key = env.BOLNA_API_KEY;
  delete env.BOLNA_API_KEY;
  try {
    const response = await request('/api/bolna-session', { method:'POST', body:'{}' });
    assert.equal(response.status, 500);
    assert.equal(JSON.parse(response.text).error, 'Voice agent is not configured');
  } finally { env.BOLNA_API_KEY = key; }
});
test('rejects oversized session requests without contacting the provider', async t => {
  const upstream=t.mock.method(globalThis, 'fetch', async()=>{ throw new Error('Must not call provider'); });
  const response=await request('/api/bolna-session', { method:'POST', body:JSON.stringify({data:'x'.repeat(9000)}) });
  assert.equal(response.status, 413);
  assert.equal(upstream.mock.callCount(), 0);
});
// ---- Project enquiry API ----
import { handleEnquiry, resetEnquiryState } from '../server-enquiry.mjs';
const enquiry = { name: 'Asha Rao', company: 'Test Logistics', email: 'asha@example.com', phone: '+91 98765 43210', system_type: 'Mezzanine', city: 'Hyderabad', details: 'Need a 500 m2 mezzanine.' };
const enquiryRequest = (body, origin) => new Request('http://prorack.test/api/enquiry', { method: 'POST',
  headers: { 'Content-Type': 'application/json', ...(origin ? { Origin: origin } : {}) }, body: JSON.stringify(body) });

test('enquiry API emails sales with the visitor as reply-to', async () => {
  resetEnquiryState();
  let sent;
  const response = await handleEnquiry(enquiryRequest(enquiry), { ENQUIRY_TO: 'sales@prorack.ai', SMTP_USER: 'web@prorack.ai' }, { ip: '1.1.1.1', send: async m => { sent = m; } });
  assert.equal(response.status, 200);
  assert.equal(sent.to, 'sales@prorack.ai');
  assert.match(sent.replyTo, /asha@example\.com/);
  assert.match(sent.subject, /Test Logistics/);
  assert.match(sent.text, /Need a 500 m2 mezzanine/);
});
test('enquiry API asks for WhatsApp fallback when email is not configured or fails', async () => {
  resetEnquiryState();
  const unconfigured = await handleEnquiry(enquiryRequest(enquiry), {}, { ip: '2.2.2.2' });
  assert.equal(unconfigured.status, 503);
  assert.equal((await unconfigured.json()).fallback, 'whatsapp');
  const failing = await handleEnquiry(enquiryRequest(enquiry), {}, { ip: '2.2.2.3', send: async () => { throw new Error('smtp down'); } });
  assert.equal(failing.status, 502);
  assert.equal((await failing.json()).fallback, 'whatsapp');
});
test('enquiry API validates input, ignores bots, blocks other sites and rate-limits', async () => {
  resetEnquiryState();
  const send = async () => {};
  assert.equal((await handleEnquiry(enquiryRequest({ ...enquiry, email: 'bad' }), {}, { ip: '3.3.3.3', send })).status, 400);
  assert.equal((await handleEnquiry(enquiryRequest({ ...enquiry, details: '' }), {}, { ip: '3.3.3.3', send })).status, 400);
  let botSent = false;
  const bot = await handleEnquiry(enquiryRequest({ ...enquiry, website: 'spam.example' }), {}, { ip: '3.3.3.4', send: async () => { botSent = true; } });
  assert.equal(bot.status, 200); assert.equal(botSent, false);
  assert.equal((await handleEnquiry(enquiryRequest(enquiry, 'https://other.test'), {}, { ip: '3.3.3.5', send })).status, 403);
  for (let i = 0; i < 5; i++) assert.equal((await handleEnquiry(enquiryRequest(enquiry), {}, { ip: '4.4.4.4', send })).status, 200);
  assert.equal((await handleEnquiry(enquiryRequest(enquiry), {}, { ip: '4.4.4.4', send })).status, 429);
});
test('production server routes POST /api/enquiry and rejects GET', async () => {
  assert.equal((await request('/api/enquiry')).status, 405);
  const response = await request('/api/enquiry', { method: 'POST', body: JSON.stringify(enquiry) });
  assert.equal(response.status, 503);
  assert.equal(JSON.parse(response.text).fallback, 'whatsapp');
});
