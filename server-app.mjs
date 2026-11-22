import http from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { mintBolnaSession } from './netlify/functions/bolna-session.mjs';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.json': 'application/json',
};
// Root-level files crawlers and verification services request by exact name.
const rootPublicFiles = new Set(['robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', 'favicon.ico',
  'apple-touch-icon.png', 'site.webmanifest', 'humans.txt', 'BingSiteAuth.xml']);
const isRootPublicFile = name => rootPublicFiles.has(name) || name.endsWith('.html')
  || /^[a-f0-9]{32}\.txt$/.test(name); // IndexNow key file
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}
function redirect(res, location) {
  res.writeHead(301, { Location: location, 'Cache-Control': 'public, max-age=3600' });
  res.end();
}
async function notFound(req, res, rootDir) {
  // Crawlers must see a real 404 status with a helpful HTML page, never JSON or a soft 200.
  try {
    const body = await readFile(path.join(rootDir, '404.html'));
    res.writeHead(404, { 'Content-Type': types['.html'], 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { json(res, 404, { error: 'Not found' }); }
}

// Hostinger runs this entry file; only the built public directory is exposed.
export function createProductionServer({ rootDir = path.join(projectDir, 'dist'), env = process.env } = {}) {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    const pathname = (req.url || '/').split('?')[0];
    const query = (req.url || '').includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const host = String(req.headers.host || '').toLowerCase();
    // One canonical host: www and other aliases consolidate ranking signals on the apex domain.
    if (host.startsWith('www.')) return redirect(res, `https://${host.slice(4)}${pathname}${query}`);
    if (host === 'prorack.ai') res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    try {
      if (pathname === '/api/bolna-session') {
        const chunks = [];
        let size = 0;
        if (req.method === 'POST') {
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 8192) return json(res, 413, { error: 'Request too large' });
            chunks.push(chunk);
          }
        }
        const request = new Request(`http://${req.headers.host}${pathname}`, {
          method: req.method, headers: req.headers,
          ...(req.method === 'POST' ? { body: Buffer.concat(chunks) } : {}),
        });
        const response = await mintBolnaSession(request, env);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(await response.text());
        return;
      }
      if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, { error: 'Method not allowed' });
      let decoded;
      try { decoded = decodeURIComponent(pathname); }
      catch { return json(res, 400, { error: 'Invalid path' }); }
      if (decoded.includes('\\') || decoded.includes('\0') || decoded.split('/').some(part => part.startsWith('.'))) {
        return notFound(req, res, rootDir);
      }
      // Duplicate URLs for the same page are 301-redirected to the one canonical URL.
      if (pathname === '/index.html' || pathname === '/index') return redirect(res, `/${query}`);
      const trimmed = decoded.replace(/^\/+/, '').replace(/\/+$/, '');
      if (trimmed && !trimmed.includes('/') && !path.extname(trimmed) && trimmed !== 'index') {
        try {
          if ((await stat(path.join(rootDir, `${trimmed}.html`))).isFile()) return redirect(res, `/${trimmed}.html${query}`);
        } catch { /* fall through to 404 */ }
        return notFound(req, res, rootDir);
      }
      if (decoded.length > 1 && decoded.endsWith('/') && trimmed.endsWith('.html')) return redirect(res, `/${trimmed}${query}`);
      const relative = trimmed || 'index.html';
      const publicRootFile = !relative.includes('/') && isRootPublicFile(relative);
      if (!publicRootFile && !relative.startsWith('assets/')) return notFound(req, res, rootDir);
      let file, info;
      try {
        const root = await realpath(rootDir);
        file = await realpath(path.join(root, relative));
        const contained = path.relative(root, file);
        if (contained.startsWith('..') || path.isAbsolute(contained)) return notFound(req, res, rootDir);
        info = await stat(file);
        if (!info.isFile()) return notFound(req, res, rootDir);
      } catch { return notFound(req, res, rootDir); }
      if (relative === '404.html') return notFound(req, res, rootDir);
      const contentType = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
      // HTML and hash-versioned CSS/JS revalidate; unversioned media is cached for a day (faster repeat visits).
      const mediaCache = /\.(webp|jpe?g|png|svg|ico|woff2?|mp4)$/i.test(file);
      const headers = { 'Content-Type': contentType, 'Content-Length': info.size,
        'Cache-Control': mediaCache ? 'public, max-age=86400' : 'public, max-age=0, must-revalidate' };
      let start = 0, end = info.size - 1, status = 200;
      if (contentType === 'video/mp4') {
        headers['Accept-Ranges'] = 'bytes';
        if (req.headers.range) {
          const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
          if (range && (range[1] || range[2])) {
            start = range[1] ? Number(range[1]) : Math.max(0, info.size - Number(range[2]));
            end = range[1] && range[2] ? Math.min(Number(range[2]), end) : end;
          }
          if (!range || (!range[1] && !range[2]) || start > end || start >= info.size) {
            res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }); res.end(); return;
          }
          status = 206;
          headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
          headers['Content-Length'] = end - start + 1;
        }
      }
      res.writeHead(status, headers);
      if (req.method === 'HEAD' || info.size === 0) { res.end(); return; }
      await pipeline(createReadStream(file, { start, end }), res);
    } catch {
      if (res.headersSent) { res.destroy(); return; }
      json(res, 502, { error: 'Voice service is temporarily unavailable. Please try again.' });
    }
  });
}
