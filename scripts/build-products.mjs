// Generates one detail page per storage system (product-<id>.html) from
// content/product-pages.json, reusing the header and footer of solutions.html
// so every product page stays in step with the rest of the site.
import { readFile, writeFile } from 'node:fs/promises';

const SITE = 'https://prorack.ai';
const content = JSON.parse(await readFile('content/product-pages.json', 'utf8'));
const solutionsPage = await readFile('solutions.html', 'utf8');

const bodyStart = solutionsPage.slice(solutionsPage.indexOf('<a class="skip-link"'), solutionsPage.indexOf('<main'));
const footer = solutionsPage.slice(solutionsPage.indexOf('<!-- FOOTER -->'), solutionsPage.indexOf('</body>'));

// Menu groups (matches the header Solutions panel) and contact-form option values.
const GROUPS = {
  'Pallet storage': ['selective', 'wide-aisle', 'narrow-aisle', 'drive-in'],
  'Shelving and structures': ['multi-tier', 'cantilever', 'flow-racking', 'mezzanine'],
  'Engineered and automated': ['rack-clad', 'automation'],
};
const CONTACT_SYSTEM = { 'narrow-aisle': 'vna', 'flow-racking': 'flow', automation: 'asrs' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const imagePath = p => `assets/editorial-photography/${p.image}`;
const groupOf = id => Object.keys(GROUPS).find(g => GROUPS[g].includes(id));
const byId = Object.fromEntries(content.products.map(p => [p.id, p]));

function jsonLd(p) {
  const url = `${SITE}/product-${p.id}.html`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${SITE}/solutions.html` },
        { '@type': 'ListItem', position: 3, name: p.title, item: url },
      ] },
      { '@type': 'Product', name: p.title, description: p.description, image: `${SITE}/${imagePath(p)}`, url,
        brand: { '@type': 'Brand', name: 'ProRack AI' },
        manufacturer: { '@type': 'Organization', name: 'ProRack Storage Solutions India Pvt. Ltd.' } },
      { '@type': 'FAQPage', mainEntity: p.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  }, null, 2);
}

function page(p) {
  const title = `${p.title} | ProRack AI`;
  const url = `${SITE}/product-${p.id}.html`;
  const contactHref = `contact.html?system=${CONTACT_SYSTEM[p.id] || p.id}`;
  const configurations = p.configurations ? `
    <section class="editorial-section shell product-configurations" aria-labelledby="configurations-title">
      <div class="editorial-section-heading"><p class="eyebrow">Configurations</p><h2 id="configurations-title">ASRS configurations</h2></div>
      <div class="product-config-grid">
        ${p.configurations.map(([id, name, text]) => `<article id="${id}"><h3>${esc(name)}</h3><p>${esc(text)}</p></article>`).join('\n        ')}
      </div>
      <p class="product-note">${esc(p.configurationsNote)}</p>
    </section>` : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#071f3f">
  <meta name="description" content="${esc(p.summary)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(p.summary)}">
  <meta property="og:image" content="${SITE}/${imagePath(p)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(p.summary)}">
  <meta name="twitter:image" content="${SITE}/${imagePath(p)}">
  <title>${esc(title)}</title>
  <link rel="icon" href="assets/Prorack%20AI%20logo%20WITHOUT%20TAGLINE.jpg">
  <link rel="preload" href="${imagePath(p)}" as="image" fetchpriority="high">
  <link rel="stylesheet" href="assets/style.css">
  <link rel="stylesheet" href="assets/editorial.css">
  <script type="application/ld+json">
${jsonLd(p)}
  </script>
</head>
<body class="public-home editorial-site page-solutions page-product">
  ${bodyStart.trim()}
  <main id="main-content" tabindex="-1">
    <section class="product-hero">
      <div class="shell product-hero-grid">
        <div class="product-hero-copy">
          <nav class="product-breadcrumb" aria-label="Breadcrumb"><a href="solutions.html">Solutions</a><span aria-hidden="true">/</span><span>${esc(groupOf(p.id))}</span></nav>
          <h1>${esc(p.title)}</h1>
          <p class="product-summary">${esc(p.summary)}</p>
          <div class="product-actions">
            <a class="product-cta" href="${contactHref}">Discuss this system <span aria-hidden="true">&rarr;</span></a>
            <a class="line-link" href="#faqs">Read the FAQs <span aria-hidden="true">&darr;</span></a>
          </div>
        </div>
        <figure class="product-hero-image"><img src="${imagePath(p)}" alt="${esc(p.title)} in a warehouse" width="1200" height="800"></figure>
      </div>
    </section>

    <section class="editorial-section shell product-overview" aria-labelledby="overview-title">
      <div class="editorial-section-heading"><p class="eyebrow">Overview</p><h2 id="overview-title">How it works</h2></div>
      <div class="product-overview-grid">
        <p class="product-description">${esc(p.description)}</p>
        <div class="product-uses"><h3>Typical applications</h3><ul>${p.uses.map(u => `<li>${esc(u)}</li>`).join('')}</ul></div>
      </div>
    </section>

    <section class="editorial-section shell product-benefits" aria-labelledby="benefits-title">
      <div class="editorial-section-heading"><p class="eyebrow">Benefits</p><h2 id="benefits-title">Why choose it</h2></div>
      <div class="product-benefit-grid">
        ${p.benefits.map(([h, t], i) => `<article><span>0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(t)}</p></article>`).join('\n        ')}
      </div>
    </section>
${configurations}
    <section class="editorial-section shell product-specs" aria-labelledby="specs-title">
      <div class="editorial-section-heading"><p class="eyebrow">Engineering</p><h2 id="specs-title">Design considerations</h2></div>
      <div>
        <dl class="product-spec-list">
          ${p.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n          ')}
        </dl>
        <p class="product-note">${esc(content.editorialNote)}</p>
      </div>
    </section>

    <section class="editorial-section shell product-faqs" id="faqs" aria-labelledby="faqs-title">
      <div class="editorial-section-heading"><p class="eyebrow">FAQs</p><h2 id="faqs-title">Common questions</h2></div>
      <div class="product-faq-list">
        ${p.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n        ')}
      </div>
    </section>

    <section class="editorial-section shell product-related" aria-labelledby="related-title">
      <div class="editorial-section-heading"><p class="eyebrow">Related systems</p><h2 id="related-title">You may also consider</h2></div>
      <div class="product-related-grid">
        ${p.related.filter(id => byId[id]).map(id => { const r = byId[id]; return `<a href="product-${r.id}.html"><img src="${imagePath(r)}" alt="" width="600" height="400" loading="lazy"><strong>${esc(r.title)}</strong><span>${esc(r.summary)}</span></a>`; }).join('\n        ')}
      </div>
    </section>

    <section class="product-final-cta">
      <div class="shell">
        <h2>Talk to us about ${esc(p.title)}</h2>
        <p>Share your storage profile, building drawings and throughput needs. Our engineers will confirm the right configuration for your site.</p>
        <a class="product-cta" href="${contactHref}">Request a consultation <span aria-hidden="true">&rarr;</span></a>
      </div>
    </section>
  </main>

  ${footer.trim()}
</body>
</html>
`;
}

for (const p of content.products) await writeFile(`product-${p.id}.html`, page(p));
console.log(`Built ${content.products.length} product pages.`);
