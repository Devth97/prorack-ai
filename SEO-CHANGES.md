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
