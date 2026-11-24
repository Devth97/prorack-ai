// Generates buyer-guide comparison pages (answer-first, tables, FAQs) from the data below,
// reusing the header, footer and company identity of solutions.html.
// Run: node scripts/generate-guide-pages.mjs  (then npm run check / npm run build)
// Every figure here is taken from the published system pages; capacities are indicative.
import fs from 'node:fs';

const O = 'https://prorack.ai';
const UPDATED = '2026-11-24';
const esc = s => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const guides = [
  {
    file: 'pallet-racking-types-compared.html',
    title: 'Pallet Racking Types Compared: Selective, VNA, Drive-In, Flow | ProRack AI',
    h1: 'Pallet racking types compared',
    eyebrow: 'Buying guide / Pallet racking',
    description: 'Compare selective, wide-aisle, VNA, drive-in and pallet flow racking by pallet access, aisle width, storage density, stock rotation and handling equipment.',
    image: 'assets/editorial-photography/narrow-aisle-multi-bay-racking.webp',
    alt: 'Very narrow aisle pallet racking in a high-bay warehouse',
    answer: 'The right pallet racking depends on how many SKUs you store, how many pallets you hold per SKU, how stock must rotate and what forklifts you use. Selective and wide-aisle racking give access to every pallet; very narrow-aisle (VNA) racking keeps that access while fitting about 40% to 45% more pallets; drive-in racking stores about 60% to 80% more pallets than selective but only gives access lane by lane; pallet flow racking enforces strict first-in, first-out rotation.',
    table: {
      caption: 'Indicative comparison. Final layouts and capacities are confirmed by project-specific design to EN 15512 and IS 800.',
      head: ['System', 'Pallet access', 'Aisle width', 'Storage density', 'Stock rotation', 'Handling equipment', 'Best for'],
      rows: [
        ['<a href="selective-pallet-racking.html">Selective pallet racking</a>', 'Every pallet', 'About 3.0 to 3.8 m', 'Baseline', 'Any (FIFO or LIFO)', 'Counterbalance and reach forklifts', 'Many SKUs, FMCG, retail distribution, cold stores'],
        ['<a href="wide-aisle-racking.html">Wide-aisle racking</a>', 'Every pallet', '3.0 to 3.8 m', 'Baseline', 'Any (FIFO or LIFO)', 'Counterbalance and reach forklifts, two-way traffic', '3PL and busy dispatch areas with several forklifts'],
        ['<a href="vna-racking.html">VNA racking</a>', 'Every pallet', 'Down to about 1.5 m', 'About 40% to 45% higher than conventional', 'Any (FIFO or LIFO)', 'Guided turret trucks or man-up order pickers', 'High land-cost sites, pharma, e-commerce hubs'],
        ['<a href="drive-in-racking.html">Drive-in / drive-through</a>', 'Front pallet of each lane', 'No aisles between lanes', 'About 60% to 80% more pallets than selective', 'LIFO (drive-in) or FIFO (drive-through)', 'Forklifts driving into the lanes', 'Cold storage, bulk stock of few SKUs'],
        ['<a href="flow-racking.html">Pallet flow racking</a>', 'Front pallet of each lane', 'Loading aisle and picking aisle', 'Dense, lanes several pallets deep', 'Strict FIFO', 'Forklifts at the loading and picking faces', 'Perishables, pharmaceutical batches, fast picking'],
      ],
    },
    sections: [
      ['How to choose in five questions', `<ol>
        <li><strong>How many SKUs, and how many pallets per SKU?</strong> Many SKUs with few pallets each point to selective, wide-aisle or VNA racking. Few SKUs with many pallets each point to drive-in or pallet flow.</li>
        <li><strong>Does stock have to rotate first-in, first-out?</strong> Expiry dates and batches favour pallet flow or drive-through racking. Drive-in racking works last-in, first-out.</li>
        <li><strong>How expensive is floor space?</strong> When land or cold-store volume is costly, VNA (with access to every pallet) or drive-in (bulk) packs more pallets into the same building.</li>
        <li><strong>What forklifts do you have or plan?</strong> Selective and wide-aisle racking work with standard counterbalance and reach trucks. VNA needs guided turret trucks and a very flat floor slab.</li>
        <li><strong>How tall is the building?</strong> VNA layouts can use heights of 18 m and more; standard layouts are set by the reach of your forklifts.</li>
      </ol>`],
      ['Mixing systems in one warehouse', '<p>Most warehouses combine systems: selective or VNA racking for the full SKU range, drive-in or flow lanes for fast-moving bulk lines, and <a href="mezzanine-floors.html">mezzanine floors</a> or <a href="multi-tier-shelving.html">multi-tier shelving</a> for small-item picking. ProRack engineers the whole layout together in Tekla Structures and RSTAB so the systems, aisles and handling equipment fit the building.</p>'],
    ],
    faq: [
      ['Which pallet racking gives the most storage?', 'Drive-in racking stores about 60% to 80% more pallets than selective racking, but only the front pallet of each lane is accessible. If you need access to every pallet, very narrow-aisle (VNA) racking gives about 40% to 45% more pallets than a conventional wide-aisle layout.'],
      ['What is the difference between selective and VNA racking?', 'Both give direct access to every pallet. Selective racking uses aisles of about 3.0 to 3.8 m for standard counterbalance and reach forklifts. VNA racking reduces aisles to about 1.5 m and uses guided turret trucks, which needs a very flat floor but stores more pallets on the same footprint.'],
      ['Which racking is best for FIFO stock rotation?', 'Pallet flow racking gives strict first-in, first-out rotation because pallets loaded at the back roll forward to the picking face. Drive-through racking also works FIFO when loaded from one side and picked from the other.'],
      ['Which racking suits cold storage?', 'Cold stores are expensive per cubic metre, so dense systems are common: drive-in racking for bulk pallets of few SKUs, or VNA racking when every pallet must stay accessible. The choice depends on the number of SKUs and how stock rotates.'],
    ],
  },
  {
    file: 'mezzanine-vs-multi-tier-shelving.html',
    title: 'Mezzanine Floor vs Multi-Tier Shelving: Which to Choose | ProRack AI',
    h1: 'Mezzanine floor vs multi-tier shelving',
    eyebrow: 'Buying guide / Using building height',
    description: 'Mezzanine floors add an open structural floor; multi-tier shelving builds picking levels into the shelving. Compare structure, loads, uses and flexibility.',
    image: 'assets/editorial-photography/mezzanine-floors.webp',
    alt: 'Industrial warehouse mezzanine floor platform structure',
    answer: 'Both use the height of your building. A mezzanine floor is an independent structural steel floor that creates open space for storage, offices, packing or assembly, designed for floor loads from 350 kg/m² to 2,000 kg/m² and more. Multi-tier shelving builds 2 to 4 picking levels into the shelving itself, with walkways between the shelves, and suits hand-picking of small items.',
    table: {
      caption: 'Indicative comparison. Loads and layouts are confirmed by project-specific structural design.',
      head: ['', 'Mezzanine floor', 'Multi-tier shelving'],
      rows: [
        ['Structure', 'Free-standing steel floor or rack-supported platform', 'Shelving uprights carry the walkways of the upper levels'],
        ['Upper level used for', 'Open floor: storage, offices, packing, assembly, staging', 'Picking aisles between shelves'],
        ['Levels', 'Usually one additional floor', '2 to 4 picking levels'],
        ['Loads', '350 kg/m² to 2,000 kg/m² and more', 'Set by shelf load and walkway design'],
        ['Decking', 'Heavy-duty grating, chequered plate or particle board', 'Steel mesh or timber walkways'],
        ['Best for', 'Sorting hubs, office-over-storage, assembly lines, buffer staging', 'Spare parts, apparel, hardware, electrical items'],
      ],
    },
    sections: [
      ['Which one fits your warehouse?', `<ul>
        <li><strong>Choose a <a href="mezzanine-floors.html">mezzanine floor</a></strong> when you need open floor area that can change use over time, carry heavy loads or host offices, packing stations or machinery.</li>
        <li><strong>Choose <a href="multi-tier-shelving.html">multi-tier shelving</a></strong> when the upper levels are only for picking many small SKUs by hand and you want storage and access in one structure.</li>
        <li><strong>Combine them</strong> when you need both: shelving on a mezzanine floor, or pallet racking below a rack-supported mezzanine.</li>
      </ul>`],
      ['Safety and approvals', '<p>Both systems are designed with stairs, handrails, gates and toe boards, and sprinkler integration is coordinated with the building fire design. Requirements for approvals vary by state and building use, so check with your local authority and fire consultant early. ProRack prepares the structural design and drawings in Tekla Structures and RSTAB as part of the project.</p>'],
    ],
    faq: [
      ['Is a mezzanine floor or multi-tier shelving better for picking?', 'Multi-tier shelving is usually better for hand-picking many small items, because the shelving and walkways form picking aisles on 2 to 4 levels. A mezzanine floor is better when the upper level needs open space for storage, offices, packing or assembly.'],
      ['How much load can a mezzanine floor carry?', 'ProRack mezzanine floors are designed for floor loads from 350 kg/m² to 2,000 kg/m² and more. The design load is set from the intended use and confirmed in the structural design.'],
      ['Can multi-tier shelving be built on a mezzanine?', 'Yes. Shelving can be installed on a mezzanine floor, and pallet racking can sit below a rack-supported mezzanine. The structure is designed for the combined loads.'],
    ],
  },
];

const base = fs.readFileSync('solutions.html', 'utf8');
const head = base.slice(0, base.indexOf('<!-- Structured Data'));
const bodyOpen = base.match(/<body[^>]*>/)[0];
const preMain = base.slice(base.indexOf(bodyOpen) + bodyOpen.length, base.indexOf('<main'));
const postMain = base.slice(base.indexOf('</main>') + '</main>'.length);
const shared = [...base.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap(m => JSON.parse(m[1])['@graph'] || []).filter(n => ['Organization', 'LocalBusiness', 'WebSite'].includes(n['@type']));

const plain = s => s.replace(/<[^>]+>/g, '');
function pageHead(g, url) {
  const img = `${O}/${g.image}`;
  return head
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(g.description)}">`)
    .replace(/<meta name="keywords" content="[^"]*">\n?\s*/, '')
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:type" content="website">/, '<meta property="og:type" content="article">')
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(g.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(g.description)}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${img}">`)
    .replace(/\s*<meta property="og:image:width" content="\d+">\s*<meta property="og:image:height" content="\d+">/, '')
    .replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${esc(g.alt)}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(g.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(g.description)}">`)
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${img}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(g.title)}</title>`)
    .replace(/<link rel="preload" href="[^"]*" as="image"/, `<link rel="preload" href="${g.image}" as="image"`);
}
function jsonLd(g, url) {
  const nodes = [
    { '@type': 'TechArticle', '@id': `${url}#article`, url, headline: g.h1, name: g.title, description: g.description, inLanguage: 'en-IN',
      image: `${O}/${g.image}`, datePublished: UPDATED, dateModified: UPDATED,
      author: { '@id': `${O}/#organization` }, publisher: { '@id': `${O}/#organization` },
      isPartOf: { '@id': `${O}/#website` }, mainEntityOfPage: url, breadcrumb: { '@id': `${url}#breadcrumb` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${O}/` },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${O}/solutions.html` },
      { '@type': 'ListItem', position: 3, name: g.h1, item: url }] },
    { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: g.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ...shared,
  ];
  return `  <!-- Structured data: article, breadcrumb, visible FAQ and company identity -->\n  <script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }, null, 2)}\n  </script>\n</head>\n`;
}
function main(g) {
  const t = g.table;
  return `  <main id="main-content" tabindex="-1">
    <section class="page-hero">
      <div class="shell">
        <span class="mono-tag">${esc(g.eyebrow)}</span>
        <h1>${esc(g.h1)}</h1>
        <p class="system-answer">${esc(g.answer)}</p>
        <div class="system-actions">
          <a href="contact.html" class="public-btn public-btn-primary">Ask an engineer about your warehouse</a>
          <a href="solutions.html#catalog" class="public-btn public-btn-ghost">All storage systems</a>
        </div>
      </div>
    </section>

    <nav class="shell system-breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="solutions.html">Solutions</a> / <span aria-current="page">${esc(g.h1)}</span></nav>

    <section class="editorial-section shell system-copy" aria-labelledby="compare-title">
      <p class="eyebrow">Side by side</p>
      <h2 id="compare-title">Comparison table</h2>
      <div class="guide-table-wrap" role="region" aria-labelledby="compare-title" tabindex="0">
        <table class="system-specs guide-table">
          <caption>${esc(t.caption)}</caption>
          <thead><tr>${t.head.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
          <tbody>
${t.rows.map(r => `            <tr><th scope="row">${r[0]}</th>${r.slice(1).map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('\n')}
          </tbody>
        </table>
      </div>
    </section>
${g.sections.map(([h, html], i) => `
    <section class="editorial-section shell system-copy" aria-labelledby="g-sec-${i}">
      <h2 id="g-sec-${i}">${esc(h)}</h2>
      ${html}
    </section>`).join('\n')}

    <section class="editorial-section shell system-faq" aria-labelledby="faq-title">
      <p class="eyebrow">Questions</p>
      <h2 id="faq-title">Frequently asked questions</h2>
${g.faq.map(([q, a]) => `      <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
      <p class="system-updated">Last updated <time datetime="${UPDATED}">24 November 2026</time> by the ProRack engineering team.</p>
    </section>

    <section class="project-invitation"><div class="shell"><p class="eyebrow">Not sure which system fits?</p><a href="contact.html"><h2>Let's make<br>space work.</h2><span class="invitation-arrow" aria-hidden="true">&#8599;</span></a><div class="invitation-base"><p>Share your building size, pallets and SKUs.<br>Our engineers will recommend a layout.</p><a href="mailto:sales@prorack.ai">sales@prorack.ai &#8599;</a><a href="tel:+917965851000">+91 79658 51000 &#8599;</a></div></div></section>
  </main>`;
}
for (const g of guides) {
  const url = `${O}/${g.file}`;
  const body = bodyOpen.replace('>', ` style="--page-image:url('/${g.image}')">`);
  fs.writeFileSync(g.file, `${pageHead(g, url)}${jsonLd(g, url)}${body}${preMain}${main(g)}${postMain}`);
  console.log('wrote', g.file, plain(g.answer).length);
}
