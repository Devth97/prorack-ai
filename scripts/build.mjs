import { cp, mkdir, rm, readdir } from 'node:fs/promises';
import path from 'node:path';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });

// Copy all root HTML files
const files = await readdir('.');
const htmlFiles = files.filter(f => f.endsWith('.html'));

await Promise.all([
  ...htmlFiles.map(f => cp(f, path.join('dist', f))),
  cp('assets', 'dist/assets', { recursive: true }),
]);

console.log(`Built dist/ with ${htmlFiles.length} HTML pages and assets`);
