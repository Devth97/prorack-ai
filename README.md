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
npm.cmd start
```

Open http://localhost:4600/. Run `npm.cmd run check` for route, asset, anchor,
portfolio and RFQ checks, or `npm.cmd run build` for the existing production build.
See [REDESIGN.md](REDESIGN.md) for the design handoff and verification evidence.

## Animated voice shortcut

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
`npm.cmd run build` rebuilds `dist/` and `dist.zip`. Voice calls require the existing
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

## Full Website Build

Build the complete website with:

```bash
npm run build
```

This runs `scripts/build.mjs`, producing a clean, zero-dependency `dist/` bundle and `dist.zip` for Hostinger upload.

## Current Hostinger Holding Page

Keep the public site on the existing under-construction page while the full site is developed:

```bash
npm run build:coming-soon
```

Upload the contents of `prorac-ai-hostinger.zip` directly into Hostinger's `public_html` directory. The archive contains no Netlify configuration or branding.
