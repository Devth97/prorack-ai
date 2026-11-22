// Notify IndexNow search engines (Bing, Yandex, Seznam, Naver; Bing results also feed
// ChatGPT search and Copilot) that the sitemap URLs changed. Run after a deployment:
//   npm run indexnow
import { readFile, readdir } from 'node:fs/promises';

const host = 'prorack.ai';
const key = (await readdir('.')).find(name => /^[a-f0-9]{32}\.txt$/.test(name))?.slice(0, 32);
if (!key) throw new Error('IndexNow key file (32 hex characters + .txt) not found in the repository root.');
const urlList = [...(await readFile('sitemap.xml', 'utf8')).matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
console.log(`IndexNow: HTTP ${response.status} for ${urlList.length} URLs (200/202 = accepted).`);
if (!response.ok && response.status !== 202) process.exitCode = 1;
