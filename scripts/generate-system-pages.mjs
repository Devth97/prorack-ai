// Generates one dedicated, crawlable page per storage system from the data below,
// reusing the header, footer and company identity of solutions.html.
// Run: node scripts/generate-system-pages.mjs  (then npm run check / npm run build)
// Specs come from the published catalog; anything project-specific is labelled indicative.
import fs from 'node:fs';

const O = 'https://prorack.ai';
const UPDATED = '2026-11-23';
// Lower-case words but keep acronyms such as VNA.
const lower = s => s.replace(/\b([A-Z])([a-z])/g, (_, a, b) => a.toLowerCase() + b);
const esc = s => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const systems = [
  {
    file: 'selective-pallet-racking.html', id: 'selective', num: '01', tag: '100% selectivity',
    name: 'Selective Pallet Racking',
    title: 'Selective Pallet Racking Manufacturer, Hyderabad | ProRack AI',
    description: 'Selective pallet racking designed and manufactured in Hyderabad: bay loads up to 20,000 kg, beam pairs 1,000 to 4,500 kg, installed across India.',
    image: 'assets/editorial-photography/selective-pallet-racking.webp',
    alt: 'Selective pallet racking warehouse system with blue uprights and orange beams',
    answer: 'Selective pallet racking is single-deep racking in which every pallet sits on a pair of beams and can be reached directly by a forklift. ProRack designs and manufactures selective racking in Hyderabad for bay loads up to 20,000 kg and installs it across India.',
    specs: [['Bay load', 'Up to 20,000 kg'], ['Beam capacity', '1,000 kg to 4,500 kg per pair'], ['Pallet access', '100% of pallets directly accessible'], ['Beam adjustment', 'Repositionable on 50 mm or 75 mm pitch'], ['Handling equipment', 'Counterbalance and reach forklifts'], ['Best for', 'High SKU variety, FMCG, retail distribution, cold stores']],
    how: ['Upright frames are connected by pairs of horizontal beams, and each pallet rests across one beam pair. Because every pallet faces an aisle, any pallet can be put away or retrieved without moving another one.', 'Beam levels can be moved as the inventory profile changes, and the system can be extended bay by bay. Safety accessories such as column protectors, rack end barriers and mesh decking are specified with the layout.'],
    choose: ['You store many different SKUs and need access to every pallet', 'Stock rotation is mixed or changes often', 'You use standard counterbalance or reach forklifts', 'You expect the layout to change as the business grows'],
    alternatives: [['vna-racking.html', 'Very narrow-aisle racking', 'when land is expensive and you need more pallet positions on the same footprint'], ['drive-in-racking.html', 'Drive-in racking', 'when you hold large quantities of a few SKUs'], ['flow-racking.html', 'Pallet flow racking', 'when strict first-in, first-out rotation is required']],
    faq: [
      ['What is the load capacity of selective pallet racking?', 'ProRack selective pallet racking is engineered for bay loads up to 20,000 kg, with beam pair capacities from 1,000 kg to 4,500 kg. The final capacity depends on the upright section, beam length, number of levels and floor slab, and is confirmed by project-specific design to EN 15512 and IS 800.'],
      ['How wide should the aisles be for selective pallet racking?', 'Aisle width is set by the forklift. Selective racking served by counterbalance and reach forklifts typically uses aisles of about 3.0 m to 3.8 m. If floor space is the constraint, very narrow-aisle racking can reduce aisles to about 1.5 m with turret trucks.'],
      ['Can selective pallet racking be reconfigured later?', 'Yes. Beam levels can be repositioned on standard 50 mm or 75 mm pitch increments and bays can be added. Any change to beam levels or loads should be checked against the load chart before use.'],
    ],
  },
  {
    file: 'wide-aisle-racking.html', id: 'wide-aisle', num: '02', tag: 'Multi-bay storage',
    name: 'Wide-Aisle Multi-Bay Racking',
    title: 'Wide-Aisle Pallet Racking System, India | ProRack AI',
    description: 'Wide-aisle multi-bay pallet racking for high-throughput warehouses: 3.0 to 3.8 m aisles for counterbalance and reach forklifts. Made in Hyderabad.',
    image: 'assets/editorial-photography/wide-aisle-multi-bay-racking.webp',
    alt: 'Wide-aisle multi-bay pallet racking with forklift operating safely',
    answer: 'Wide-aisle multi-bay racking is pallet racking laid out with aisles of about 3.0 m to 3.8 m so that standard counterbalance and reach forklifts can work and pass each other. ProRack manufactures it in Hyderabad for 3PL, distribution and general warehouses across India.',
    specs: [['Aisle width', '3.0 m to 3.8 m'], ['Handling equipment', 'Standard counterbalance and reach forklifts'], ['Traffic', 'Two-way forklift movement and buffer staging'], ['Configuration', 'Multi-bay runs, single or back-to-back'], ['Best for', '3PL fulfilment centres, general warehousing, heavy machinery spares']],
    how: ['Long runs of pallet racking are arranged in multi-bay rows with aisles wide enough for forklifts to turn, pass and stage pallets. Several trucks can work at the same time, which suits high put-away and dispatch volumes.', 'Because no specialised trucks are needed, a wide-aisle layout works with an existing forklift fleet and is simple to operate and expand.'],
    choose: ['Several forklifts work in the same area at peak times', 'You want to use your existing counterbalance or reach trucks', 'Fast put-away and dispatch matter more than maximum density', 'You need staging space next to the racking'],
    alternatives: [['vna-racking.html', 'Very narrow-aisle racking', 'when you need more pallet positions on the same footprint'], ['selective-pallet-racking.html', 'Selective pallet racking', 'for the beam, upright and load details behind each bay'], ['drive-in-racking.html', 'Drive-in racking', 'for bulk storage of a few SKUs']],
    faq: [
      ['What is the difference between wide-aisle and very narrow-aisle racking?', 'Wide-aisle racking uses aisles of about 3.0 m to 3.8 m and standard counterbalance or reach forklifts. Very narrow-aisle racking reduces aisles to about 1.5 m and uses guided turret trucks or order pickers, giving higher storage density but requiring specialised equipment and a very flat floor.'],
      ['Which forklifts can work in a wide-aisle racking layout?', 'Standard counterbalance forklifts and reach trucks. The exact aisle width is set by the truck model, load size and turning radius during layout design.'],
      ['Who is wide-aisle racking best suited for?', 'It suits 3PL fulfilment centres, general warehousing and heavy machinery spares, where many forklift movements happen at the same time and throughput matters more than maximum density.'],
    ],
  },
  {
    file: 'vna-racking.html', id: 'vna', num: '03', tag: 'High-density VNA',
    name: 'Very Narrow-Aisle (VNA) Racking',
    title: 'VNA Very Narrow Aisle Racking Manufacturer | ProRack AI',
    description: 'Very narrow-aisle (VNA) racking with aisles down to 1.5 m and heights of 18 m and more, for 40% to 45% higher storage density. Made in Hyderabad.',
    image: 'assets/editorial-photography/narrow-aisle-multi-bay-racking.webp',
    alt: 'Very narrow aisle VNA pallet racking reaching warehouse ceiling',
    answer: 'Very narrow-aisle (VNA) racking is pallet racking with aisles as narrow as about 1.5 m, served by guided turret trucks or man-up order pickers. It can reach building heights of 18 m and more and gives about 40% to 45% higher storage density than a conventional layout.',
    specs: [['Aisle width', 'Down to about 1.5 m'], ['Building height', 'Up to 18 m and more'], ['Storage density', '40% to 45% higher than a conventional layout'], ['Handling equipment', 'Turret trucks or man-up order pickers'], ['Guidance', 'Wire guidance or mechanical floor rails'], ['Best for', 'High land-cost regions, pharmaceutical, e-commerce hubs']],
    how: ['Aisles are reduced to little more than the width of the pallet, and specialised turret trucks lift and turn the load inside the aisle. The trucks are guided by a wire in the floor or by rails, so they run safely close to the racking.', 'Because VNA trucks reach great heights in a narrow aisle, the floor slab must be very flat and the racking, truck and building are designed together.'],
    choose: ['Land or building space is expensive', 'The building is tall and you want to use its full height', 'You need access to every pallet as well as high density', 'You are prepared to invest in guided VNA trucks'],
    alternatives: [['wide-aisle-racking.html', 'Wide-aisle racking', 'if you want to keep standard forklifts'], ['drive-in-racking.html', 'Drive-in racking', 'if you store large quantities of a few SKUs'], ['mezzanine-floors.html', 'Mezzanine floors', 'to add floor area for picking or offices']],
    faq: [
      ['How narrow can the aisles be in VNA racking?', 'VNA aisles can be reduced to about 1.5 m. The exact width depends on the pallet size, the VNA truck model and the guidance system, and is fixed during layout design.'],
      ['What floor is needed for VNA racking?', 'VNA trucks lift loads to great heights in narrow aisles, so the floor slab must be very flat and level along the truck wheel tracks. Floor flatness, slab capacity and guidance installation are checked as part of the design.'],
      ['How much more storage does VNA racking provide?', 'VNA layouts typically give about 40% to 45% higher storage density than conventional wide-aisle racking on the same footprint, while keeping direct access to every pallet.'],
    ],
  },
  {
    file: 'drive-in-racking.html', id: 'drive-in', num: '04', tag: 'Compact block storage',
    name: 'Drive-In / Drive-Through Racking',
    title: 'Drive-In and Drive-Through Racking Manufacturer | ProRack AI',
    description: 'Drive-in and drive-through racking for dense block storage: 60% to 80% more pallets than selective racking, for cold stores and bulk stock. Made in Hyderabad.',
    image: 'assets/editorial-photography/drive-in-drive-through-racking.webp',
    alt: 'Drive-in pallet racking system with forklift in storage lane',
    answer: 'Drive-in racking removes the aisles between rack rows so forklifts drive into the racking and place pallets on rails, one behind another. Drive-in works last-in, first-out; drive-through is open at both ends and works first-in, first-out. It stores about 60% to 80% more pallets than selective racking.',
    specs: [['Storage density', '60% to 80% higher than selective racking'], ['Stock rotation', 'LIFO (drive-in) or FIFO (drive-through)'], ['Guidance', 'Floor guidance channels and heavy-duty upright guards'], ['Pallet access', 'Lane by lane, not every pallet'], ['Best for', 'Cold storage, seasonal goods, bulk homogeneous stock']],
    how: ['Instead of beams, pallets rest on continuous rails on each side of a lane. The forklift drives into the lane and places pallets from the back to the front, so a single lane holds many pallets of the same product.', 'In drive-in racking the lane is entered from one side only, so the last pallet in is the first out. Drive-through racking is open at both ends, so pallets are loaded on one side and picked from the other.'],
    choose: ['You hold large quantities of relatively few SKUs', 'Space is expensive, as in cold stores', 'Products are not time-critical, or FIFO is handled with drive-through', 'Pallets are of consistent size and quality'],
    alternatives: [['selective-pallet-racking.html', 'Selective pallet racking', 'when you need access to every pallet'], ['flow-racking.html', 'Pallet flow racking', 'for strict FIFO with dense storage'], ['vna-racking.html', 'VNA racking', 'for density with full selectivity']],
    faq: [
      ['What is the difference between drive-in and drive-through racking?', 'Drive-in racking is entered from one side only, so it works last-in, first-out. Drive-through racking is open at both ends, so pallets are loaded from one side and retrieved from the other on a first-in, first-out basis.'],
      ['Is drive-in racking suitable for cold storage?', 'Yes. Cold stores are expensive to build and run per cubic metre, and drive-in racking stores about 60% to 80% more pallets than selective racking in the same space, which makes it a common choice for frozen and chilled goods.'],
      ['What are the limitations of drive-in racking?', 'Only the pallet at the front of each lane is accessible, so it suits few SKUs with many pallets each. Forklift drivers work inside the racking, so guidance channels, upright guards and operator training are important.'],
    ],
  },
  {
    file: 'multi-tier-shelving.html', id: 'multi-tier', num: '05', tag: 'Multi-level picking',
    name: 'Multi-Tier Shelving',
    title: 'Multi-Tier Shelving Systems Manufacturer, India | ProRack AI',
    description: 'Multi-tier shelving with 2 to 4 picking levels, walkways, stairs, handrails and toe boards for spares, apparel and e-commerce picking. Made in Hyderabad.',
    image: 'assets/editorial-photography/multi-tier-shelving.webp',
    alt: 'Multi-tier shelving structure with walkways and stairs for manual picking',
    answer: 'Multi-tier shelving is a shelving structure built on two to four levels, with walkways, stairs and safety gates between them, so that staff can hand-pick small items from the full height of the building. ProRack designs and manufactures multi-tier shelving in Hyderabad.',
    specs: [['Picking levels', '2 to 4 tiers'], ['Walkways', 'Steel mesh or timber decking'], ['Access', 'Stairs, safety gates and carton chutes'], ['Safety', 'Toe boards, handrails, fire sprinkler integration'], ['Best for', 'Automotive spare parts, apparel, hardware, electrical items']],
    how: ['The shelving uprights carry the walkways of the upper levels, so one structure provides both storage and access floors. Pickers walk the aisles on each level and send goods down through chutes or lifts.', 'Stairs, gates, handrails and toe boards are designed in from the start, and sprinkler integration is coordinated with the fire design for the building.'],
    choose: ['You pick small items or cartons by hand', 'You have many SKUs with low quantities each', 'The building has height you are not using', 'You want storage and access in one structure'],
    alternatives: [['mezzanine-floors.html', 'Mezzanine floors', 'when you need an open floor for offices, assembly or packing'], ['flow-racking.html', 'Carton flow racking', 'for fast FIFO picking faces'], ['selective-pallet-racking.html', 'Selective pallet racking', 'for full pallets']],
    faq: [
      ['What is the difference between multi-tier shelving and a mezzanine floor?', 'In multi-tier shelving the shelving itself supports the upper walkways, so the structure is designed around picking aisles. A mezzanine floor is an independent structural floor that creates open space which can be used for storage, offices or assembly.'],
      ['How many levels can multi-tier shelving have?', 'ProRack multi-tier shelving is typically built with 2 to 4 picking levels. The number of levels depends on the building height, loads, access and fire safety requirements.'],
      ['How is fire safety handled in multi-tier shelving?', 'Walkway decking, handrails, toe boards and stairs are designed in, and sprinkler integration is coordinated with the building fire design. Local fire regulations should be confirmed early in the project.'],
    ],
  },
  {
    file: 'cantilever-racking.html', id: 'cantilever', num: '06', tag: 'Long goods and pipes',
    name: 'Cantilever Racking',
    title: 'Heavy-Duty Cantilever Racking Manufacturer | ProRack AI',
    description: 'Heavy-duty cantilever racking for pipes, steel sections, timber and PVC: arm capacities from 250 kg to 2,500 kg and more. Made in Hyderabad, India.',
    image: 'assets/editorial-photography/cantilever-racking.webp',
    alt: 'Cantilever racking holding long steel pipes and profiles',
    answer: 'Cantilever racking stores long and irregular goods such as pipes, steel sections, timber and PVC on arms that project from vertical columns, with no front uprights in the way. ProRack cantilever arms are designed for 250 kg to 2,500 kg and more per arm.',
    specs: [['Arm capacity', '250 kg to 2,500 kg and more per arm'], ['Configuration', 'Single-sided against a wall or double-sided in the centre'], ['Access', 'Open front with no front uprights'], ['Best for', 'Steel pipes, extruded aluminium, timber, PVC conduit, coils']],
    how: ['Vertical columns stand on bases, and arms project from the columns to carry the load. With no front uprights, long items can be loaded from the side by forklift, side loader or crane.', 'Arm length, arm capacity and column spacing are chosen from the longest, heaviest and most flexible item stored, so loads rest on enough arms not to sag.'],
    choose: ['You store pipes, bars, sections, sheets or timber', 'Items are longer than a standard pallet bay', 'You need to load with side loaders or cranes', 'Item lengths vary'],
    alternatives: [['selective-pallet-racking.html', 'Selective pallet racking', 'for palletised goods'], ['mezzanine-floors.html', 'Mezzanine floors', 'to add floor area above storage'], ['wide-aisle-racking.html', 'Wide-aisle racking', 'for mixed pallet storage']],
    faq: [
      ['What can be stored on cantilever racking?', 'Cantilever racking is designed for long, bulky and irregular items such as steel pipes, extruded aluminium, timber, PVC conduit, sheets and coils that do not fit a standard pallet bay.'],
      ['How much weight can a cantilever arm hold?', 'ProRack cantilever arms are designed for 250 kg to 2,500 kg and more per arm. The final rating depends on arm length, column section and how the load is spread, and is confirmed by project-specific design.'],
      ['Should cantilever racking be single-sided or double-sided?', 'Single-sided cantilever racking stands against a wall and is loaded from one side. Double-sided racking stands in the middle of the floor and is loaded from both sides, giving more capacity per column.'],
    ],
  },
  {
    file: 'flow-racking.html', id: 'flow-rack', num: '07', tag: 'FIFO dynamic flow',
    name: 'Pallet and Carton Flow Racking',
    title: 'Pallet and Carton Flow Racking (FIFO) Manufacturer | ProRack AI',
    description: 'Gravity pallet and carton flow racking for strict first-in, first-out stock rotation, with brake rollers and end stops. Designed and made in Hyderabad.',
    image: 'assets/editorial-photography/pallet-carton-flow-racking.webp',
    alt: 'Gravity flow racking with roller lanes for FIFO stock rotation',
    answer: 'Flow racking uses gently inclined roller lanes so that pallets or cartons loaded at the back move by gravity to the picking face at the front. It gives strict first-in, first-out stock rotation and separates replenishment from picking.',
    specs: [['Stock rotation', 'Strict first-in, first-out (FIFO)'], ['Movement', 'Gravity-fed roller lanes'], ['Safety', 'Speed-controller brake rollers and end-stop separators'], ['Types', 'Pallet flow and carton flow'], ['Best for', 'Perishable goods, pharmaceutical expiry batches, high-speed picking']],
    how: ['Each lane is a slightly inclined bed of rollers. Pallets or cartons are loaded at the upper end and roll forward until they reach the front, where they are picked. When one is removed, the next moves forward.', 'Brake rollers control the speed of loaded pallets, and separators at the picking end take the pressure of the lane off the front pallet so it can be lifted safely.'],
    choose: ['Products have expiry dates or batches', 'You need strict FIFO without extra handling', 'You want to separate loading from picking', 'Picking speed is critical'],
    alternatives: [['drive-in-racking.html', 'Drive-through racking', 'for dense FIFO block storage at lower cost'], ['multi-tier-shelving.html', 'Multi-tier shelving', 'for manual picking of small items'], ['selective-pallet-racking.html', 'Selective pallet racking', 'when every pallet must be accessible']],
    faq: [
      ['How does pallet flow racking work?', 'Pallets are loaded at the back of an inclined roller lane and move forward by gravity to the picking face. Brake rollers control the speed and separators at the front protect the operator when the first pallet is removed.'],
      ['What is the difference between pallet flow and carton flow racking?', 'Pallet flow racking moves full pallets for bulk picking or dispatch. Carton flow racking uses lighter roller or wheel lanes for cartons and totes, usually at waist height for fast manual order picking.'],
      ['What are the requirements for flow racking to work reliably?', 'Flow lanes need pallets or cartons of consistent size, weight and base quality, because damaged or irregular pallets can stop in the lane. Load details are reviewed during design so the rollers and brakes suit the actual goods.'],
    ],
  },
  {
    file: 'mezzanine-floors.html', id: 'mezzanine', num: '08', tag: 'Structural expansion',
    name: 'Mezzanine Floors and Platforms',
    title: 'Mezzanine Floor Manufacturer in Hyderabad, India | ProRack AI',
    description: 'Industrial mezzanine floors and rack-supported platforms with floor loads from 350 to 2,000 kg/m² and more, engineered in Tekla and RSTAB. Made in Hyderabad.',
    image: 'assets/editorial-photography/mezzanine-floors.webp',
    alt: 'Industrial warehouse mezzanine floor platform structure',
    answer: 'An industrial mezzanine floor is a structural steel platform built inside an existing building to add usable floor area without extending the building. ProRack designs free-standing and rack-supported mezzanines for floor loads from 350 kg/m² to 2,000 kg/m² and more, engineered in Tekla Structures and RSTAB.',
    specs: [['Floor loading', '350 kg/m² to 2,000 kg/m² and more'], ['Types', 'Free-standing structural steel or rack-supported'], ['Decking', 'Heavy-duty grating, chequered plate or particle board'], ['Engineering', 'Tekla Structures and RSTAB'], ['Best for', 'Sorting hubs, office-over-storage, assembly lines, buffer staging']],
    how: ['Columns and beams carry a new floor at an intermediate height in the building. A free-standing mezzanine has its own steel frame, while a rack-supported mezzanine uses the racking below as its structure.', 'Stairs, handrails, gates and loading points are designed with the floor. Column positions are coordinated with the slab, the racking below and the material flow.'],
    choose: ['You need more floor area but cannot extend the building', 'You want offices, packing or assembly above storage', 'The building has clear height above the working floor', 'You want space that can later be moved or extended'],
    alternatives: [['multi-tier-shelving.html', 'Multi-tier shelving', 'when the upper levels are only for picking aisles'], ['vna-racking.html', 'VNA racking', 'to use height for pallet storage'], ['selective-pallet-racking.html', 'Selective pallet racking', 'for pallet storage below the mezzanine']],
    faq: [
      ['What floor loads can a ProRack mezzanine carry?', 'ProRack mezzanine floors are designed for floor loads from 350 kg/m² to 2,000 kg/m² and more. The design load is set from the intended use, such as offices, storage or machinery, and confirmed in the structural design.'],
      ['What is the difference between a free-standing and a rack-supported mezzanine?', 'A free-standing mezzanine has its own columns and beams and leaves an open floor below. A rack-supported mezzanine uses the storage racking as its structure, which is efficient when the area below is used for racking.'],
      ['Do mezzanine floors need approvals?', 'Requirements vary by state and building use, so check with the local authority and fire consultant early. ProRack prepares the structural design and drawings in Tekla Structures and RSTAB as part of the project.'],
    ],
  },
];

// ---- template parts taken from solutions.html so header, footer and identity stay identical ----
const base = fs.readFileSync('solutions.html', 'utf8');
const head = base.slice(0, base.indexOf('<!-- Structured Data'));
const bodyOpen = base.match(/<body[^>]*>/)[0];
const preMain = base.slice(base.indexOf(bodyOpen) + bodyOpen.length, base.indexOf('<main'));
const postMain = base.slice(base.indexOf('</main>') + '</main>'.length);
const graph = [...base.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .flatMap(m => JSON.parse(m[1])['@graph'] || []);
const shared = graph.filter(n => ['Organization', 'LocalBusiness', 'WebSite'].includes(n['@type']));

function pageHead(s, url) {
  const img = `${O}/${s.image}`;
  return head
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(s.description)}">`)
    .replace(/<meta name="keywords" content="[^"]*">\n?\s*/, '')
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(s.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(s.description)}">`)
    .replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${img}">`)
    .replace(/\s*<meta property="og:image:width" content="\d+">\s*<meta property="og:image:height" content="\d+">/, '')
    .replace(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${esc(s.alt)}">`)
    .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(s.title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(s.description)}">`)
    .replace(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${img}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(s.title)}</title>`)
    .replace(/<link rel="preload" href="[^"]*" as="image"/, `<link rel="preload" href="${s.image}" as="image"`);
}

function jsonLd(s, url) {
  const nodes = [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: s.title, description: s.description, inLanguage: 'en-IN',
      isPartOf: { '@id': `${O}/#website` }, about: { '@id': `${url}#product` }, publisher: { '@id': `${O}/#organization` },
      primaryImageOfPage: { '@type': 'ImageObject', url: `${O}/${s.image}` }, breadcrumb: { '@id': `${url}#breadcrumb` }, dateModified: UPDATED },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${O}/` },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: `${O}/solutions.html` },
      { '@type': 'ListItem', position: 3, name: s.name, item: url }] },
    { '@type': 'Product', '@id': `${url}#product`, name: s.name, description: s.answer, image: `${O}/${s.image}`, url,
      category: 'Warehouse Racking System', brand: { '@type': 'Brand', name: 'ProRack AI' }, manufacturer: { '@id': `${O}/#organization` },
      areaServed: { '@type': 'Country', name: 'India' },
      additionalProperty: [...s.specs.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
        { '@type': 'PropertyValue', name: 'Design code', value: 'EN 15512 / IS 800' }] },
    { '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: s.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ...shared,
  ];
  return `  <!-- Structured data: page, breadcrumb, product, visible FAQ and company identity -->\n  <script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }, null, 2)}\n  </script>\n</head>\n`;
}

function main(s) {
  const li = items => items.map(x => `<li>${esc(x)}</li>`).join('');
  return `  <main id="main-content" tabindex="-1">
    <section class="page-hero">
      <div class="shell">
        <span class="mono-tag">System ${s.num} / ${esc(s.tag)}</span>
        <h1>${esc(s.name)}</h1>
        <p class="system-answer">${esc(s.answer)}</p>
        <div class="system-actions">
          <a href="contact.html?system=${s.id}" class="public-btn public-btn-primary">Request a layout and quotation</a>
          <a href="solutions.html#catalog" class="public-btn public-btn-ghost">All storage systems</a>
        </div>
      </div>
    </section>

    <nav class="shell system-breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="solutions.html">Solutions</a> / <span aria-current="page">${esc(s.name)}</span></nav>

    <section class="editorial-section shell system-overview" aria-labelledby="specs-title">
      <div>
        <p class="eyebrow">At a glance</p>
        <h2 id="specs-title">${esc(s.name)} specifications</h2>
        <table class="system-specs">
          <caption>Indicative specifications. Final capacities and configurations are confirmed by project-specific structural design to EN 15512 and IS 800.</caption>
          <tbody>
${s.specs.map(([k, v]) => `            <tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('\n')}
            <tr><th scope="row">Design codes</th><td>EN 15512, IS 800 and IS 1893 seismic checks</td></tr>
            <tr><th scope="row">Manufactured in</th><td>Hyderabad, Telangana, India; installed across India</td></tr>
          </tbody>
        </table>
      </div>
      <figure><img src="${s.image}" alt="${esc(s.alt)}" width="1600" height="1000" loading="lazy"><figcaption>${esc(s.name)} by ProRack AI</figcaption></figure>
    </section>

    <section class="editorial-section shell system-copy" aria-labelledby="how-title">
      <p class="eyebrow">How it works</p>
      <h2 id="how-title">How ${esc(lower(s.name))} works</h2>
      ${s.how.map(p => `<p>${esc(p)}</p>`).join('\n      ')}
    </section>

    <section class="editorial-section shell system-fit" aria-labelledby="fit-title">
      <div>
        <p class="eyebrow">Is it the right fit?</p>
        <h2 id="fit-title">When to choose ${esc(lower(s.name))}</h2>
        <ul>${li(s.choose)}</ul>
      </div>
      <div>
        <p class="eyebrow">Compare</p>
        <h2>When another system may fit better</h2>
        <ul>${s.alternatives.map(([href, label, why]) => `<li><a class="line-link" href="${href}">${esc(label)}</a> ${esc(why)}.</li>`).join('')}</ul>
      </div>
    </section>

    <section class="editorial-section shell system-copy" aria-labelledby="quote-title">
      <p class="eyebrow">Planning a project</p>
      <h2 id="quote-title">What we need for a quotation</h2>
      <ul>${li(['Project location and expected timeline', 'Warehouse dimensions, clear height and column grid', 'Pallet or item dimensions and weights', 'Number of storage positions required', 'Handling equipment in use or planned', 'Floor slab details, if available'])}</ul>
      <p>ProRack reviews the requirement, prepares a layout and structural design in Tekla Structures and RSTAB, manufactures in Hyderabad and installs through SmartFit Solutions. <a class="line-link" href="engineering.html">See how we engineer projects</a>.</p>
    </section>

    <section class="editorial-section shell system-faq" aria-labelledby="faq-title">
      <p class="eyebrow">Questions</p>
      <h2 id="faq-title">${esc(s.name)} FAQs</h2>
${s.faq.map(([q, a]) => `      <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
      <p class="system-updated">Last updated <time datetime="${UPDATED}">23 November 2026</time> by the ProRack engineering team.</p>
    </section>

    <section class="project-invitation"><div class="shell"><p class="eyebrow">Discuss your ${esc(lower(s.name))} project</p><a href="contact.html?system=${s.id}"><h2>Let's make<br>space work.</h2><span class="invitation-arrow" aria-hidden="true">&#8599;</span></a><div class="invitation-base"><p>Share your layout and load details.<br>Our engineers will recommend a configuration.</p><a href="mailto:sales@prorack.ai">sales@prorack.ai &#8599;</a><a href="tel:+917965851000">+91 79658 51000 &#8599;</a></div></div></section>
  </main>`;
}

for (const s of systems) {
  const url = `${O}/${s.file}`;
  const body = bodyOpen.replace('>', ` style="--page-image:url('/${s.image}')">`);
  const html = `${pageHead(s, url)}${jsonLd(s, url)}${body}${preMain}${main(s)}${postMain}`;
  fs.writeFileSync(s.file, html);
  console.log('wrote', s.file);
}
export { systems };
