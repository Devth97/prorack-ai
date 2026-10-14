import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

// Check every existing static route, local asset and fragment, including React search links.
const root=path.resolve('.');
const pages=(await fs.readdir(root)).filter(name=>name.endsWith('.html'));
const documents=new Map(await Promise.all(pages.map(async name=>[name,await fs.readFile(name,'utf8')])));
const errors=[];
async function checkLink(from,href){
  if(!href || /^(https?:|mailto:|tel:|data:)/.test(href)) return;
  const url=new URL(href,`https://local.test/${from}`);
  const file=decodeURIComponent(url.pathname.slice(1)) || 'index.html';
  try {await fs.access(path.join(root,file));} catch {errors.push(`${from}: missing ${href}`);return;}
  if(url.hash && file.endsWith('.html')){
    const html=documents.get(file)||await fs.readFile(file,'utf8');
    const id=decodeURIComponent(url.hash.slice(1));
    if(!html.includes(`id="${id}"`)) errors.push(`${from}: missing fragment ${href}`);
  }
}
for(const [name,html] of documents){
  assert.ok(!/\u2014|&mdash;|&#(?:8212|x2014);/i.test(html), `${name}: no em dashes in website copy`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${name}: exactly one h1`);
  assert.ok(html.includes('id="main-content"'),`${name}: skip destination`);
  assert.ok(html.includes('assets/editorial.css'),`${name}: shared identity`);
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) await checkLink(name,match[1]);
  for(const match of html.matchAll(/<img\b[^>]+>/g)) if(!/alt="[^"]*"/.test(match[0])) errors.push(`${name}: image missing alt`);
}
const app=await fs.readFile('src/app.jsx','utf8');
for(const match of app.matchAll(/href: '([^']+)'/g)) await checkLink('index.html',match[1]);
const catalog=documents.get('solutions.html');
assert.equal((catalog.match(/<article class="solution-card"/g)||[]).length,8,'Eight racking systems');
const contact=documents.get('contact.html');
for(const name of ['name','company','email','phone','details']) {
 assert.ok(contact.includes(`for="inquiry-${name}"`),`${name}: associated label`);
 assert.match(contact,new RegExp(`<(?:input|textarea)[^>]*id="inquiry-${name}"[^>]*required`),`${name}: required`);
}
assert.ok(contact.includes('action="mailto:sales@prorack.ai"'),'Existing submission integration retained');
assert.ok(contact.includes('This form opens your email application'),'Submission behavior explained');
assert.deepEqual(errors,[]);
console.log(`PASS: ${pages.length} routes, static/React links, assets, anchors, eight systems, form labels and required fields.`);
