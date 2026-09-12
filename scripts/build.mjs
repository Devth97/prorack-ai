import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
await Promise.all([
  cp('index.html', 'dist/index.html'),
  cp('assets', 'dist/assets', { recursive: true }),
]);
console.log('Built dist/');
