import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const versions = new Map();
for (const asset of ['app.js', 'editorial.css', 'style.css']) {
  versions.set(asset, createHash('sha256').update(await readFile(`dist/assets/${asset}`)).digest('hex').slice(0, 12));
}
const pages = (await readdir('dist')).filter(file => file.endsWith('.html'));
for (const page of pages) {
  const html = await readFile(`dist/${page}`, 'utf8');
  for (const match of html.matchAll(/assets\/(app\.js|editorial\.css|style\.css)([^"\s]*)/g)) {
    assert.equal(match[2], `?v=${versions.get(match[1])}`, `${page}: current ${match[1]} version`);
  }
  assert.ok(html.includes(`assets/app.js?v=${versions.get('app.js')}`), `${page}: versioned script`);
}
for (const file of ['_headers', 'dist/_headers', 'netlify.toml']) {
  const config = await readFile(file, 'utf8');
  assert.ok(config.includes('max-age=0, must-revalidate'), `${file}: browser revalidation`);
  assert.ok(!config.includes('immutable'), `${file}: no immutable unversioned assets`);
}
console.log(`PASS: ${pages.length} built pages reference content-verified asset versions; source/build/Netlify headers revalidate.`);
