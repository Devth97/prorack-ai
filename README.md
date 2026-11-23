# prorack.ai

Digital intelligence layer connecting business systems, engineering, manufacturing, physical machines, and project execution across the industrial storage lifecycle.

## Brand Architecture

- **`prorackglobal.com`**: Corporate entity, warehouse racking catalog, and steel manufacturing plant.
- **`prorack.ai`**: Digital intelligence, automation, and connected operational layers across systems.
- **`gosmartfit.ai`**: Warehouse installation execution, surveying, and site erection management platform.

## Core Operational Idea

One continuous intelligence layer across the complete 10-stage project lifecycle:
`CRM / ERPNext` → `Engineering / Tekla` → `Tekla PowerFab` → `Manufacturing Floor` → `Machine PLCs` → `Quality Control` → `Warehouse Staging` → `Dispatch Logistics` → `Site Installation (GoSmartFit)` → `Management Intelligence`

**Core Architecture Principle:** ProRack AI does not replace source systems of record (ERPNext, Microsoft 365, Tekla Structures, PowerFab, or shop floor PLCs); it indexes, connects, and interprets them.

## Local Preview

The redesigned site keeps the existing React + esbuild components, static `.html`
routes, Netlify configuration and submission integration. Start the local preview:

```powershell
npm.cmd run bundle
npm.cmd run preview
```

Open http://localhost:4600/. Run `npm.cmd run check` for route, asset, anchor,
portfolio and RFQ checks, or `npm.cmd run build` for the existing production build.
See [REDESIGN.md](REDESIGN.md) for the design handoff and verification evidence.

## Animated voice shortcut

RackBot now has a cyan smile in both SVG poses. The homepage uses the approved
line: "Designed & manufactured in Hyderabad, India and installed Pan India."
Website copy was checked with SlopMonster and reviewed in a second pass by Claude.
The upstream checker and MIT license are in `scripts/slopmonster/`:
`python scripts/slopmonster/deslop.py index.html`. Technical hyphens and ordinary
service lists are retained when flagged. `npm run check` also rejects em dashes
in the HTML pages. Source: https://github.com/ItsssssJack/SlopMonster

The shared React header mounts the approved orange-and-steel RackBot through a portal to
the document body. Click the mascot or waveform to open the existing Bolna voice
panel, then choose Start conversation. The dock also links to enquiries and lets
visitors minimize the mascot. RackBot continuously cycles between waving and
typing on a tablet every eight seconds, with separate moving hand layers. The live
waveform follows the call state; reduced-motion preferences disable animation.
Touch interaction does not outline the character; keyboard focus is shown on the
Ask RackBot caption. There is no manual motion toggle.

`node scripts/check-mascot.mjs` checks every mascot
state/mute combination. `npm.cmd run check` checks all website routes, and
`npm.cmd run build` rebuilds `dist/` without generating deployment archives. Voice calls require the existing
`/api/bolna-session` backend and Bolna environment configuration; static hosting
alone serves the mascot but does not provide that backend.
Production builds version script and stylesheet URLs by content hash, and assets
revalidate with the server. Run `node scripts/check-build-cache.mjs` after building
to verify cache configuration and generated asset references.

### Mascot rollback checkpoint

The Git tag `checkpoint/pre-mascot-2026-10-13` preserves the complete website before
the mascot at commit `fe1b09d`. The tag `checkpoint/pre-rackbot-2026-10-13` preserves
the original blue mascot at `25a0b98`. Revert the RackBot update commit to return to
the blue mascot. To remove the mascot entirely, revert the RackBot update first,
then revert `25a0b98`, and push the resulting commits with `git push origin main`.
Reverting preserves later unrelated work; use the checkpoint tag to inspect the
previous version. Do not reset or force-push the shared branch to roll back.

Run any static server from the repository root:

```bash
# Python
python -m http.server 4600

# Node.js
npx serve .
```

## Hostinger production deployment (website and RackBot)

RackBot requires a running backend at `POST /api/bolna-session`. A React/static
publish of `dist/` serves the website but does not run Netlify Functions or read
server environment variables. A 404 at that URL indicates the backend is missing;
adding environment variables alone cannot create the route.

Use the connected GitHub repository and these Hostinger build settings:

| Setting | Value |
| --- | --- |
| Framework preset | Other (run a Node.js backend) |
| Node.js | 22.x or 24.x |
| Root directory | `./` |
| Build command | `npm run build` |
| Entry file | `server.mjs` (relative to the repository root) |
| Output directory, if shown | `.` (retain the server and its modules; do not publish only `dist`) |
| Start command, if shown | `npm start` |
| Environment variables | `BOLNA_API_KEY`, `BOLNA_AGENT_ID` |

Keep the existing secret values in Hostinger environment variables. Do not prefix
these keys with `VITE_` or put them in browser code. Redeploy after changing the
framework, entry file, or runtime variables. The application listens on Hostinger's
`PORT`, serves built files from `dist/`, and uses the same session handler as Netlify.
The server must be launched from the repository with `server-app.mjs` and
`netlify/functions/` present. The entry starts its HTTP listener even when a managed
host imports it; it must not be wrapped in an argv or main-module check.
The public files remain inside `dist/`; source files and `.env` are not served.

Check the deployment's runtime logs for `ProRack website and RackBot API listening
on port ...`. Opening `/api/bolna-session` in a browser should return JSON with
HTTP 405 (POST is required), rather than Hostinger's HTML 404 page. Then start a
RackBot conversation with microphone permission and verify a successful session
POST. A JSON 500 saying the voice agent is not configured means the running Node
process still needs the two runtime variables; provider errors need separate
credential/account checks.

Local production verification:

```powershell
npm ci
npm test
npm run check
npm run build
npm start
```

The regression tests use a mocked voice provider and never consume real call
minutes. `npm run preview` retains the source preview on port 4600. Production
`npm start` defaults to port 3000 and requires a completed build.

The Netlify deployment can remain active during the migration. Remove or pause it
only after the Hostinger API and an actual voice call have been verified.

Hostinger reference: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/

## Project enquiries and WhatsApp

- Every page has a WhatsApp button (bottom-left) that opens a free click-to-chat with Kshitij Salve,
  VP Sales (+91 98199 95285), pre-filled with the page the visitor was reading.
- The contact form posts to `POST /api/enquiry` (`server-enquiry.mjs`), which validates the form,
  drops bot submissions (hidden honeypot field), rate-limits to 5 enquiries per IP per 10 minutes and
  emails the enquiry to `ENQUIRY_TO` with the visitor as reply-to.
- Email is sent with Microsoft Graph from the free shared mailbox `enquiries@prorack.ai`
  (Kshitij Salve and Zeneta have Full Access). Hostinger environment variables: `MS_TENANT_ID`,
  `MS_CLIENT_ID`, `MS_CLIENT_SECRET` (Entra app "ProRack Website Enquiries", Microsoft Graph
  application permission Mail.Send, admin consented), `MAIL_FROM=enquiries@prorack.ai` and
  `ENQUIRY_TO=enquiries@prorack.ai` (comma-separated for more). SMTP (`SMTP_HOST`, `SMTP_PORT`,
  `SMTP_USER`, `SMTP_PASS`) also works if Graph is not configured. Redeploy after changing them.
  When the client secret expires, create a new one in Entra and update `MS_CLIENT_SECRET`.
- Until email is configured, or if sending fails, the form opens WhatsApp with the full enquiry so the
  lead still reaches sales. Without JavaScript the form falls back to `mailto:sales@prorack.ai`.
- Leads are tracked as GA4 `generate_lead` events once a GA4 tag is added to the pages.
