import { cp, mkdir, rm, readdir } from 'node:fs/promises';
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
