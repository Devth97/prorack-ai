# ProRack SEO / AEO / GEO update: 22 November 2026

Goal: make https://prorack.ai the one clearly identified "ProRack" warehouse racking
entity for Google, Bing and AI answer engines (ChatGPT, Claude, Perplexity, Gemini,
Copilot), and retire signals pointing at the deleted Netlify deployment.

## Live-site findings (before this change)

| Finding | Effect |
| --- | --- |
| `www.prorack.ai` is a Cloudflare CNAME to `velvety-ganache-baf4e1.netlify.app` (the deleted Netlify site) | www returns a Netlify 404; search engines still associate the brand with Netlify. **DNS fix required, see below.** |
| Missing pages returned JSON 404 | Poor crawler and visitor experience |
| `/solutions`, `/solutions.html`, `/index.html` and `/` all returned 200 | Duplicate URLs split ranking signals |
| No `/favicon.ico` | No brand icon in Google results |
| Company page declared a different Organization name under the same `@id` as the homepage | Inconsistent entity for Knowledge Graph / LLMs |
| "ProRack" is shared with Pelican cases, WillScot, Proslat, vehicle racks and server cabinets | Brand query is ambiguous; needs explicit disambiguation |

## Code changes

- **server-app.mjs**: www to apex 301; `/index.html` to `/`; extensionless and trailing-slash URLs 301 to the canonical `.html`;
  real HTML 404 page (`404.html`, noindex); HSTS; serves favicon, manifest, `llms-full.txt`, IndexNow key and `BingSiteAuth.xml`; media cached for a day.
- **All pages**: favicon set, apple-touch icon, web manifest, theme colour, `max-image-preview:large` robots directive,
  `og:site_name`, `og:locale=en_IN`, `og:image:alt`, geo meta and a link to `llms.txt`.
- **JSON-LD**: one identical `Organization` entity on every page (legal name, alternate names, disambiguating description,
  logo ImageObject, address, areas served, `knowsAbout`, parent group, LinkedIn `sameAs`), plus `LocalBusiness`, `WebSite`
  and a `WebPage` / `AboutPage` / `ContactPage` node linked to them. Leadership `Person` entities on the company page.
- **Answer-engine content**: visible Q&A "What is ProRack AI?" and "Is ProRack AI related to other ProRack products?" on the
  homepage; four company questions on the company page; FAQ schema generated to match the visible text exactly.
- **llms.txt**: brand identity and disambiguation section, full leadership, hours. Build now also writes **llms-full.txt** (all page text).
- **robots.txt**: adds Claude-SearchBot, GoogleOther, Amazonbot, DuckAssistBot, MistralAI-User, CCBot, Applebot, DuckDuckBot.
- **sitemap.xml**: image sitemap entries, refreshed `lastmod`.
- **IndexNow**: key file in the root plus `npm run indexnow` to notify Bing/Yandex after each deploy.
- Checks: `npm test` (redirect + 404 tests), `npm run check` (identical Organization on every page, favicon/manifest/404 present).

## Actions only the site owner can do (biggest ranking impact)

1. **Cloudflare DNS**: change `www` from the Netlify CNAME to `prorack.ai` (CNAME, proxied) or Hostinger's address, and add
   `www.prorack.ai` as an alias in Hostinger. Delete any other record pointing to `*.netlify.app`.
2. **Google Search Console**: add a *Domain* property for `prorack.ai` (DNS TXT in Cloudflare), submit `https://prorack.ai/sitemap.xml`,
   use URL Inspection to request indexing of `/`, `/solutions.html`, `/company.html`, `/contact.html`.
3. **Bing Webmaster Tools**: import from Search Console, submit the sitemap, then run `npm run indexnow`. Bing feeds ChatGPT search and Copilot.
4. **Google Business Profile**: create / verify "ProRack Storage Solutions India Pvt. Ltd." at the Secunderabad address with
   website `https://prorack.ai`, the same phone and hours. This is the main driver for local "racking manufacturer Hyderabad" results.
5. **Consistent citations (NAP)**: same name, address, phone and URL on LinkedIn, IndiaMART, TradeIndia, JustDial, Crunchbase,
   and the prorackglobal.com group site linking to prorack.ai. Add every verified profile URL to `sameAs` in the JSON-LD.
6. **Old Netlify URLs**: they disappear from Google as it recrawls and sees them gone; this cannot be forced for a site you no longer control.

---

# ProRack SEO changes — 14 October 2026

Scope: audit all 12 static pages, improve the existing site, and publish only to
the `prorackai.netlify.app` preview. Keep the `prorack.ai` holding page unchanged.
The preferred domain remains `https://prorack.ai` at the user's request.

## Implemented

| Observed issue | Change |
| --- | --- |
| Homepage canonical ended in `/index.html`, but sitemap and social URL used `/` | Use `/` consistently |
| Homepage title and introduction did not clearly identify the product and location | Name warehouse racking manufacturing and Hyderabad |
| Homepage navigation depended on JavaScript | Include the same static navigation fallback used by other pages |
| Homepage lacked direct buyer questions | Add three expandable answers and links to solutions and enquiries |
| Engineering and solutions FAQ schema described different answers from the page | Match the visible questions and answers exactly |
| Execution contained FAQ schema without visible FAQ content | Remove the unmatched markup |
| Homepage hours said Monday–Friday until 18:00; contact page says Monday–Saturday until 18:30 | Match the published contact page |
| Business coordinates conflicted across pages and were not verified | Remove precise coordinates; retain the consistent postal address |
| Organization and LocalBusiness used the same ID on different pages | Use a consistent LocalBusiness ID |
| Managing Director was labeled founder without supporting visible evidence | Remove the founder relationship; preserve visible leadership information |
| Custom racking schema claimed InStock without published prices | Remove the unsupported offers; keep the eight-product catalog |
| AI summary instructed answer engines to cite the company | Replace promotional instructions with scope and factual limitations; add the missing Copilot link |
| Sitemap dates did not reflect edited pages | Update only the six revised HTML pages |

## Validation

- `npm run check`: existing route, asset, fragment and enquiry-form checks plus
  the new SEO checks for all 12 pages.
- `npm run build`: rebuild the production files and `dist.zip`.
- `node scripts/check-seo.mjs dist`: verify the published build's canonical and
  sitemap URLs, social images, JSON-LD, business address/hours, and eight FAQ
  answers that match the HTML.
- `node scripts/check-build-cache.mjs`: verify generated asset references.
- Chrome: open the local homepage and expand its first buyer question.
- Ruflo diff risk review: low risk before deployment.

## Sources and limits

Applied the prioritization and evidence principles from
[OpenSEO's audit workflow](https://github.com/every-app/open-seo/blob/main/plugins/openseo/skills/seo-audit/SKILL.md)
and the technical, entity-clarity and direct-answer checklist from
[SNLabat's SEO/GEO/AEO skill](https://github.com/SNLabat/SEO-GEO-AEO-Skill/blob/main/SKILL.md).
These were used as reference workflows; OpenSEO was not installed or connected.
No paid keyword, ranking, backlink or first-party Search Console data was used.
No ranking or traffic increase is claimed.

The main domain currently serves an under-construction page, verified in Chrome.
Publishing changes on the preview does not update that domain. Search impact on
the main domain must wait until the full site is intentionally launched there.

FAQ markup is kept accurate for consumers that use it. It is not a promise of a
Google FAQ rich result. Google's current documentation records that feature's
removal and explains that `llms.txt` is not needed for Google Search:
[Search documentation updates](https://developers.google.com/search/updates).

Not assessed: Core Web Vitals field measurements, search indexing, query volumes,
backlinks, conversion data, and independent verification of existing engineering
claims. The existing contact details and technical claims remain owner-supplied.
