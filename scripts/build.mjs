import { cp, mkdir, rm, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import path from 'node:path';

console.log('Cleaning dist directory...');
await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });

// Copy all root HTML files plus the root-level files the live site depends on.
// Anything missing here silently breaks crawling (robots/sitemap/llms) or
// host routing (_headers/_redirects) in production, so warn rather than skip quietly.
const rootFiles = ['sitemap.xml', 'robots.txt', 'llms.txt', '_headers', '_redirects'];
const files = await readdir('.');
const publishFiles = files.filter(f => f.endsWith('.html') || rootFiles.includes(f));

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

const missingRootFiles = rootFiles.filter(f => !files.includes(f));
if (missingRootFiles.length) {
  console.warn(`WARNING: expected root files not found: ${missingRootFiles.join(', ')}`);
}

console.log(`Built dist/ with ${publishFiles.length} files (HTML, sitemap, robots, llms) and assets.`);

// Create dist.zip archive for direct upload to Hostinger.
try {
  console.log('Compressing dist/ into dist.zip...');
  if (process.platform === 'win32') {
    execSync('powershell -NoProfile -ExecutionPolicy Bypass -File scripts/make-zip.ps1', {
      stdio: 'inherit'
    });
  } else {
    execSync('cd dist && zip -r ../dist.zip ./*', { stdio: 'inherit' });
  }
} catch (err) {
  console.warn('Could not automatically create dist.zip:', err.message);
}
