# Property Cost AI Platform Demo

A sanitized static demo for an AI-enabled property operations platform.

This repository is designed for GitHub display only. It is not a fork of any production repository, does not contain production history, does not connect to any database, and does not include real business data.

## What It Shows

- Portal home for module routing
- Portfolio command center with synthetic region, project and risk signals
- Cost overview with 12-month budget, actual, paid and variance mock data
- Material price library with reviewer-confirmed rows and AI import candidates
- Cost map with regional benchmark cards, pressure heat matrix and action pool
- Contract payment progress, due-soon queue and risk exposure
- Smart Q&A with local match, vision extract and deep answer mock states
- Account and permission center with role boundaries and visitor masking

## Demo Scale Snapshot

The public demo now uses a richer fictional operating model:

- 86 managed projects across a synthetic 12-region portfolio
- 18,420 material price rows represented by safe sample records
- 312 contract ledger items summarized through mock risk KPIs
- 3,842 AI knowledge matches and 1,284 simulated review tasks
- A cost-map action pool with $4.30M in fictional savings opportunities

These numbers are designed to communicate product scope. They are not production metrics.

## Demo Data Notice

All organizations, regions, projects, suppliers, contracts, prices, dates and question-answer cases are fictional. The static asset in `public/assets/design-direction.png` was generated as a visual design direction and contains only mock labels.

No production files are required or expected.

## Run Locally

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:4173/
```

The app is plain HTML, CSS and JavaScript. There are no npm dependencies.

## Checks

```bash
npm run check
```

Before publishing, also run a manual scan for forbidden content:

- `.env`
- `data/`
- `uploads/`
- database dumps or SQLite files
- spreadsheets or contract attachments
- real domains, server IPs, internal accounts or secrets

## Why This Shape

The first version is intentionally static. It is safer for open-source display, easy to preview locally, and can later be published through GitHub Pages after a final sensitivity review.

## Documentation

- [Demo scope](docs/demo-scope.md)
- [Data sanitization](docs/data-sanitization.md)
- [Product story](docs/product-story.md)
- [Public release checklist](docs/public-release-checklist.md)
