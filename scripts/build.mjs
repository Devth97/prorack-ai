import { cp, mkdir, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

import path from 'node:path';

console.log('Cleaning dist directory...');
await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });

// Copy all root HTML files plus the root-level files the live site depends on.
// Anything missing here silently breaks crawling (robots/sitemap/llms) or
// host routing (_headers/_redirects) in production, so warn rather than skip quietly.
const rootFiles = ['sitemap.xml', 'robots.txt', 'llms.txt', 'favicon.ico', 'apple-touch-icon.png', 'site.webmanifest', '_headers', '_redirects'];
const files = await readdir('.');
// Optional verification files: IndexNow key (32 hex chars .txt), Bing XML and Google HTML tokens.
const isVerificationFile = f => /^[a-f0-9]{32}\.txt$/.test(f) || f === 'BingSiteAuth.xml';
const publishFiles = files.filter(f => f.endsWith('.html') || rootFiles.includes(f) || isVerificationFile(f));

await Promise.all([
  ...publishFiles.map(f => cp(f, path.join('dist', f))),
  cp('assets', 'dist/assets', { recursive: true }),
]);

// New URLs bypass older browser copies that were cached as immutable for a year.
const assetVersions = new Map(await Promise.all(['app.js', 'editorial.css', 'style.css'].map(async name => {
  const contents = await readFile(path.join('dist/assets', name));
  return [name, createHash('sha256').update(contents).digest('hex').slice(0, 12)];
})));
for (const name of publishFiles.filter(name => name.endsWith('.html'))) {
  const file = path.join('dist', name);
  const html = await readFile(file, 'utf8');
  const versioned = html.replace(/assets\/(app\.js|editorial\.css|style\.css)(?:\?v=[a-f0-9]+)?/g,
    (_, asset) => `assets/${asset}?v=${assetVersions.get(asset)}`);
  await writeFile(file, versioned);
}

// llms-full.txt: the readable text of every page in sitemap order, so AI crawlers that
// do not execute JavaScript can read and cite the complete site from one file.
const decodeEntities = text => text
  .replace(/&#x([\da-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
  .replace(/&(amp|quot|apos|lt|gt|nbsp|rsquo|lsquo|rdquo|ldquo|rarr|middot|ndash|hellip);/g, (_, name) => ({
    amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', rsquo: '’', lsquo: '‘',
    rdquo: '”', ldquo: '“', rarr: '→', middot: '·', ndash: '–', hellip: '…',
  })[name]);
const pageText = html => decodeEntities((html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || '')
  .replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<(h[1-6])\b[^>]*>/gi, '\n\n## ')
  .replace(/<(br|\/p|\/li|\/h[1-6]|\/summary|\/details|\/tr|\/article|\/section)\b[^>]*>/gi, '\n')
  .replace(/<li\b[^>]*>/gi, '\n- ')
  .replace(/<[^>]+>/g, ' '))
  .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
const sitemapUrls = [...(await readFile('sitemap.xml', 'utf8')).matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const llmsSections = [];
for (const url of sitemapUrls) {
  const name = new URL(url).pathname.slice(1) || 'index.html';
  const html = await readFile(name, 'utf8');
  const title = decodeEntities(html.match(/<title>(.*?)<\/title>/s)?.[1] || name);
  const description = decodeEntities(html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '');
  llmsSections.push(`# ${title}\nURL: ${url}\n${description ? `Summary: ${description}\n` : ''}\n${pageText(html)}`);
}
const llmsIntro = (await readFile('llms.txt', 'utf8')).trim();
await writeFile('dist/llms.txt', `${llmsIntro}\n`);
await writeFile('dist/llms-full.txt', `${llmsIntro}\n\n---\n\n# Full page text\n\n${llmsSections.join('\n\n---\n\n')}\n`);

const missingRootFiles = rootFiles.filter(f => !files.includes(f));
if (missingRootFiles.length) {
  console.warn(`WARNING: expected root files not found: ${missingRootFiles.join(', ')}`);
}

console.log(`Built dist/ with ${publishFiles.length} files (HTML, sitemap, robots, llms) and assets.`);
