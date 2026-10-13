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
