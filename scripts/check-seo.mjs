import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(process.argv[2] || '.');
const origin = 'https://prorack.ai';
const pages = (await fs.readdir(root)).filter(name => name.endsWith('.html'));
const sitemap = await fs.readFile(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const titles = new Set();
const canonicals = [];
const businesses = [];
let faqCount = 0;
const plain = text => text.replace(/<[^>]*>/g, ' ')
  .replace(/&(?:amp|quot|apos|lt|gt|nbsp);|&#(?:x[\da-f]+|\d+);/gi, entity => {
    if (entity.startsWith('&#')) return String.fromCodePoint(entity[2].toLowerCase() === 'x' ? parseInt(entity.slice(3), 16) : parseInt(entity.slice(2), 10));
    return { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' }[entity.toLowerCase()];
  }).replace(/\s+/g, ' ').trim();

for (const name of pages) {
  const html = await fs.readFile(path.join(root, name), 'utf8');
  const canonical = `${origin}/${name === 'index.html' ? '' : name}`;
  canonicals.push(canonical);
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`), `${name}: canonical`);
  assert.ok(!/<meta[^>]+content="[^"]*noindex/i.test(html), `${name}: indexable`);
  const title = plain(html.match(/<title>(.*?)<\/title>/s)?.[1] || '');
  assert.ok(title && !titles.has(title), `${name}: unique title`);
  titles.add(title);
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(description, `${name}: description`);
  assert.ok(html.includes(`<meta property="og:url" content="${canonical}">`), `${name}: social URL`);
  const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  assert.ok(image?.startsWith(`${origin}/assets/`), `${name}: absolute social image`);
  await fs.access(path.join(root, decodeURIComponent(new URL(image).pathname)));
  const details = [...html.matchAll(/<details\b[^>]*>(.*?)<\/details>/gs)].map(m => m[1]);
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    const data = JSON.parse(match[1]);
    for (const node of data['@graph'] || [data]) {
      if (node['@type'] === 'LocalBusiness') {
        assert.equal(node['@id'], `${origin}/#localbusiness`, `${name}: stable business identity`);
        businesses.push(node);
      }
      if (node['@type'] === 'FAQPage') {
        assert.ok(node.mainEntity.length, `${name}: nonempty FAQ`);
        for (const question of node.mainEntity) {
          assert.ok(details.some(detail => {
            const q = detail.match(/<summary[^>]*>(.*?)<\/summary>/s)?.[1];
            const a = detail.match(/<p\b[^>]*>(.*?)<\/p>/s)?.[1];
            return q && a && plain(q) === question.name && plain(a) === question.acceptedAnswer.text;
          }), `${name}: FAQ must match a visible question and answer: ${question.name}`);
          faqCount++;
        }
      }
      if (node['@type'] === 'ItemList') {
        for (const item of node.itemListElement) assert.ok(!item.item.offers, `${name}: no unverified stock or price`);
      }
    }
  }
}
assert.deepEqual(canonicals.sort(), sitemapUrls.sort(), 'Every page has one sitemap URL matching its canonical');
for (const business of businesses) assert.deepEqual(business.address, businesses[0].address, 'Consistent business address');
const hours = businesses.filter(b => b.openingHoursSpecification).map(b => [b.openingHoursSpecification].flat());
assert.deepEqual(hours[0], hours[1], 'Homepage and contact business hours agree');
assert.ok((await fs.readFile(path.join(root, 'robots.txt'), 'utf8')).includes(`Sitemap: ${origin}/sitemap.xml`));
console.log(`PASS: SEO for ${pages.length} pages, sitemap/canonical/social URLs, JSON-LD, business identity and ${faqCount} visible FAQ answers (${root}).`);
