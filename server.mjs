import http from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { mintBolnaSession } from './netlify/functions/bolna-session.mjs';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};
function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

// Hostinger runs this entry file; only the built public directory is exposed.
export function createProductionServer({ rootDir = path.join(projectDir, 'dist'), env = process.env } = {}) {
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    const pathname = (req.url || '/').split('?')[0];
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
        return json(res, 404, { error: 'Not found' });
      }
      let relative = decoded.replace(/^\/+/, '') || 'index.html';
      if (!path.extname(relative)) relative += '.html';
      const publicRootFile = !relative.includes('/') && (relative.endsWith('.html') || ['robots.txt', 'sitemap.xml', 'llms.txt'].includes(relative));
      if (!publicRootFile && !relative.startsWith('assets/')) return json(res, 404, { error: 'Not found' });
      let file, info;
      try {
        const root = await realpath(rootDir);
        file = await realpath(path.join(root, relative));
        const contained = path.relative(root, file);
        if (contained.startsWith('..') || path.isAbsolute(contained)) return json(res, 404, { error: 'Not found' });
        info = await stat(file);
        if (!info.isFile()) return json(res, 404, { error: 'Not found' });
      } catch { return json(res, 404, { error: 'Not found' }); }
      const contentType = types[path.extname(file).toLowerCase()] || 'application/octet-stream';
      const headers = { 'Content-Type': contentType, 'Content-Length': info.size, 'Cache-Control': 'public, max-age=0, must-revalidate' };
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

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 3000);
  createProductionServer().listen(port, '0.0.0.0', () => {
    console.log(`ProRack website and RackBot API listening on port ${port}`);
    if (!process.env.BOLNA_API_KEY || !process.env.BOLNA_AGENT_ID) console.warn('RackBot requires BOLNA_API_KEY and BOLNA_AGENT_ID at runtime.');
  });
}