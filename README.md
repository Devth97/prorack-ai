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

Run any static server from the repository root:

```bash
# Python
python -m http.server 4600

# Node.js
npx serve .
```

## Build & Deployment

Netlify builds the distribution using `netlify.toml`:

```bash
npm run build
```

This runs `scripts/build.mjs`, producing a clean, zero-dependency `dist/` bundle.
