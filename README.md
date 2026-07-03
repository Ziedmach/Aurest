# Dubai Property Intel

An interactive product prototype for the core broker journey:

1. Capture a buyer profile
2. Rank matching property inventory
3. Review buyer-specific reasoning
4. Prepare a branded recommendation
5. Generate a WhatsApp-ready pitch

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current scope

This is a complete frontend demonstration using fake data. It includes:

- Solo broker dashboard and core buyer-to-report journey
- Buyer pipeline, profiles, persona summaries and assignment views
- Property inventory, search, layout controls, quality indicators and import entry points
- Transparent buyer/property matching with ranked reasons
- Report templates, library, status, sharing and export simulations
- WhatsApp-ready sales content
- Saved searches and new-match feed
- Market benchmarks, yield indicators and DLD-ready provenance treatment
- Team analytics, member roles and workspace activity
- Admin policies, plan usage and endpoint readiness
- Workspace branding and report-cover preview
- Responsive desktop/mobile layouts

The frontend does not persist data, authenticate users, call an AI model, send messages, or generate a real PDF yet. Every required backend route, payload, permission rule and implementation convention is documented in [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md).
