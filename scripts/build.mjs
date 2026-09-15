import { cp, mkdir, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

console.log('Cleaning dist directory...');
await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });

// Copy all root HTML files
const files = await readdir('.');
const htmlFiles = files.filter(f => f.endsWith('.html'));

await Promise.all([
  ...htmlFiles.map(f => cp(f, path.join('dist', f))),
  cp('assets', 'dist/assets', { recursive: true }),
]);

// Copy Netlify configuration files into dist/
if (existsSync('_redirects')) {
  await cp('_redirects', 'dist/_redirects');
}
if (existsSync('_headers')) {
  await cp('_headers', 'dist/_headers');
}

console.log(`Built dist/ with ${htmlFiles.length} HTML pages, assets, and Netlify config.`);

// Create dist.zip archive for direct upload / Netlify Drop
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
