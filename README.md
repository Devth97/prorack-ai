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

The shared React header mounts a floating blue robot mascot through a portal to
the document body. Click the mascot or waveform to open the existing Bolna voice
panel, then choose Start conversation. The dock also links to enquiries and lets
visitors minimize the mascot. Idle floating/blinking, connecting laptop, and live
waveform poses follow the call state; reduced-motion preferences disable animation.

With the preview running, `node scripts/check-mascot.mjs` checks every mascot
state/mute combination. `npm.cmd run check` checks all website routes, and
`npm.cmd run build` rebuilds `dist/` and `dist.zip`. Voice calls require the existing
`/api/bolna-session` backend and Bolna environment configuration; static hosting
alone serves the mascot but does not provide that backend.

### Mascot rollback checkpoint

The Git tag `checkpoint/pre-mascot-2026-10-13` preserves the complete website before
the mascot at commit `fe1b09d`. The mascot is kept in its own commit so it can be
removed later with `git revert <mascot-commit>` followed by `git push origin main`.
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
