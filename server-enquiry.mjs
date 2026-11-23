// Project enquiry endpoint: POST /api/enquiry (JSON). Validates the form, blocks bots,
// and emails the enquiry to the sales inbox through Microsoft Graph (preferred) or SMTP.
//
// Runtime environment variables (set in Hostinger, never in browser code):
// Microsoft Graph (Microsoft 365, modern auth, works with MFA; no SMTP AUTH needed):
//   MS_TENANT_ID      Entra directory (tenant) ID
//   MS_CLIENT_ID      Application (client) ID of the app registration
//   MS_CLIENT_SECRET  client secret value (Mail.Send application permission, admin consented)
//   MAIL_FROM         mailbox the enquiry is sent from, e.g. website@prorack.ai (a free shared mailbox)
// Or SMTP:
//   SMTP_HOST   e.g. smtp.office365.com (Microsoft 365) or smtp.hostinger.com
//   SMTP_PORT   587 (STARTTLS, default) or 465 (TLS)
//   SMTP_USER   mailbox used to send, e.g. sales@prorack.ai
//   SMTP_PASS   that mailbox's password or app password
//   ENQUIRY_TO  where enquiries go (default sales@prorack.ai); comma-separated for several
//   ENQUIRY_FROM optional From address (default SMTP_USER)
// If SMTP is not configured or sending fails, the API answers 503 and the browser
// hands the same enquiry to WhatsApp instead, so no lead is lost.
import nodemailer from 'nodemailer';

const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

const FIELDS = { name: 120, company: 160, email: 160, phone: 40, system_type: 80, city: 120, details: 4000, page: 200 };
const REQUIRED = ['name', 'company', 'email', 'phone', 'details'];
const hits = new Map(); // ip -> timestamps, simple in-memory rate limit
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

let transport;
function getTransport(env) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null;
  if (!transport) {
    const port = Number(env.SMTP_PORT || 587);
    transport = nodemailer.createTransport({
      host: env.SMTP_HOST, port, secure: port === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
    });
  }
  return transport;
}

// ---- Microsoft Graph sender (client-credentials token, cached until shortly before expiry) ----
let graphToken;
async function graphAccessToken(env, fetchImpl) {
  if (graphToken && graphToken.expires > Date.now() + 60000) return graphToken.value;
  const response = await fetchImpl(`https://login.microsoftonline.com/${encodeURIComponent(env.MS_TENANT_ID)}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: env.MS_CLIENT_ID, client_secret: env.MS_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default', grant_type: 'client_credentials' }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw new Error(`Graph token failed: ${response.status} ${data.error || ''}`.trim());
  graphToken = { value: data.access_token, expires: Date.now() + Number(data.expires_in || 3600) * 1000 };
  return graphToken.value;
}
const recipients = list => String(list).split(',').map(s => s.trim()).filter(Boolean).map(address => ({ emailAddress: { address } }));
function graphSender(env, fetchImpl = globalThis.fetch) {
  if (!env.MS_TENANT_ID || !env.MS_CLIENT_ID || !env.MS_CLIENT_SECRET || !env.MAIL_FROM) return null;
  return async message => {
    const token = await graphAccessToken(env, fetchImpl);
    const response = await fetchImpl(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(env.MAIL_FROM)}/sendMail`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ saveToSentItems: true, message: {
        subject: message.subject, body: { contentType: 'Text', content: message.text },
        toRecipients: recipients(message.to), replyTo: [{ emailAddress: { address: message.replyToAddress, name: message.replyToName } }],
      } }),
    });
    if (response.status !== 202 && !response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(`Graph sendMail failed: ${response.status} ${detail?.error?.code || ''}`.trim());
    }
  };
}

export function resetEnquiryState() { hits.clear(); transport = undefined; graphToken = undefined; }

export async function handleEnquiry(req, env = process.env, { ip = 'unknown', send, fetchImpl = globalThis.fetch } = {}) {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(req.url).host) return json(403, { error: 'Forbidden' });

  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return json(429, { error: 'Too many enquiries. Please call or WhatsApp us.' });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return json(400, { error: 'Invalid request' });
  // Honeypot: real visitors never see or fill the "website" field.
  if (body.website) return json(200, { ok: true });

  const data = {};
  for (const [key, max] of Object.entries(FIELDS)) data[key] = String(body[key] ?? '').trim().slice(0, max);
  const missing = REQUIRED.filter(k => !data[k]);
  if (missing.length) return json(400, { error: `Please fill in: ${missing.join(', ')}` });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return json(400, { error: 'Please enter a valid email address' });
  if (!/^[+\d][\d\s()-]{6,}$/.test(data.phone)) return json(400, { error: 'Please enter a valid phone number' });
  recent.push(now); hits.set(ip, recent);

  const lines = [
    `Name: ${data.name}`, `Company: ${data.company}`, `Email: ${data.email}`, `Phone: ${data.phone}`,
    `Storage system: ${data.system_type || 'Not specified'}`, `City / location: ${data.city || 'Not specified'}`,
    `Page: ${data.page || 'contact.html'}`, '', 'Requirement:', data.details,
  ];
  const replyToName = data.name.replace(/[<>"\r\n]/g, '');
  const message = {
    from: env.ENQUIRY_FROM || env.MAIL_FROM || env.SMTP_USER,
    to: env.ENQUIRY_TO || 'sales@prorack.ai',
    replyTo: `${replyToName} <${data.email}>`,
    replyToAddress: data.email, replyToName,
    subject: `Website enquiry: ${data.company.replace(/[\r\n]/g, ' ')} (${data.system_type || 'general'})`,
    text: lines.join('\n'),
  };

  const smtp = getTransport(env) && (({ replyToAddress, replyToName: _n, ...m }) => getTransport(env).sendMail(m));
  const sender = send || graphSender(env, fetchImpl) || smtp;
  if (!sender) return json(503, { error: 'Email delivery is not configured', fallback: 'whatsapp' });
  try {
    await sender(message);
    return json(200, { ok: true });
  } catch (error) {
    console.error('Enquiry email failed:', error?.code || error?.message || error);
    return json(502, { error: 'Email delivery failed', fallback: 'whatsapp' });
  }
}
