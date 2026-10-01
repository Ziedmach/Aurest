# Acronis partnership workspace — context for Claude

Read this first when working anywhere under `workspaces/acronis/`. It is the standing brief
for all Acronis work by Next Step Middle East. Treat `00-context/` as the source of truth for
facts and update it rather than this file when facts change.

## Who we are

- **Next Step Middle East** (also Next Step IT, NextStep ME, next-step.tn): an EMEA
  cybersecurity, cloud infrastructure and managed-services group. ISO 9001 and ISO 27001
  certified, NCA ECC aligned. Offices: Riyadh, Tunis, Nice, Kigali, Tripoli, Nouakchott.
  Cloud service capabilities in Tunisia, Libya and Rwanda. Figures used in corporate material:
  2,000+ projects, 900+ active clients, 150+ certified resources.
- Vendor ecosystem: Microsoft (specializations across Cloud, Security, Modern Work),
  Red Hat Premier, Cisco Premier, Fortinet and Secureworks (MSSP), Sophos, VMware, AWS.
- Taglines: "Answering your technology needs" (group), "Secure. Scalable. Sovereign." (Middle East).
- The user is Zied Machkena (ziedmachkena@gmail.com), driving strategy, GTM and sales for
  the partnership.

## The partnership

- Acronis is a **new technology-vendor partnership under the Next Step umbrella**, signed in 2026.
- Model: **both reseller and service provider, transitioning**. Next Step holds an Acronis
  Cyber Protect Cloud tenant (service-provider model, monthly commitment tiers) and can also
  resell licenses through distribution where a customer insists on owning licenses.
- First markets: **Saudi Arabia** and **Africa** (North Africa from Tunis and Tripoli,
  sub-Saharan from Kigali and Nouakchott). Other EMEA markets follow.
- Target customers: SMB end customers, other MSPs and IT resellers (Next Step as the
  distribution-style layer), and mid-market and enterprise accounts.
- Customer-facing templates are written in **English**. Arabic and French versions are
  produced on demand.

## Pricing facts that must stay consistent

- Price list in force: **Acronis Cyber Cloud Calculator C26.09, USD**. Partner buy prices,
  per unit per month. See `30-pricing/README.md`.
- Eight commitment tiers: 250, 500, 1,000, 2,000, 4,000, 7,000, 10,000, 15,000 USD per month.
- Data center groups: G1 (most DCs) and G2 (Abu Dhabi, Johannesburg, Taipei). No Acronis DC
  in Saudi Arabia; in-Kingdom residency is served with Next Step hosted storage.
- Quote model: `30-pricing/acronis-quote-model.xlsx`, rebuilt by
  `90-templates/build-quote-model.py`. Sell price = buy ÷ (1 − margin) × FX rate.
- Margin policy: **not yet decided**. The model carries placeholder margins by SKU family
  (Bundles 35 percent, Security 40, Backup & DR 35, Storage 25, Operations 30,
  Infrastructure 20, Other 10). Never present these as approved; label any customer price
  derived from them as indicative until the policy is logged in `10-strategy/decisions-log.md`.

## Voice and format rules

- Follow the Next Step design system (claude.ai artifact "Next Step Design System"):
  calm, executive, precise. Sentence case. No emoji, no exclamation marks, no hype.
  "We" for Next Step, "you / your institution" for the client. Lead with hard proof and units.
- Brand colors: emerald `#014737` primary, sand gold `#c6a87a` accent (text gold `#8a6d3e`
  on light), infra navy `#17324d`, cyber teal `#0097a7`, royal olive `#4f5b2c`.
  Fonts: Quicksand (display), Inter (body), JetBrains Mono (data).
- Documents carry document control (title, version, date, classification, validity) as in
  the Next Step proposal templates.
- Always name the data center and residency option in anything customer-facing.
- Acronis product names are used exactly: Acronis Cyber Protect Cloud, Ultimate Protection,
  Backup + DR, Security + RMM, MDR by Acronis TRU, Cyber Frame, Cyber Workspace,
  Acronis Cyber Files Cloud, Acronis Cyber Infrastructure.

## Folder map

| Folder | Purpose |
|---|---|
| `00-context/` | Facts: Next Step profile, Acronis profile, partner program, product catalogue, competitors |
| `10-strategy/` | Partnership strategy, business case, 90-day plan, decisions log |
| `20-gtm/` | Go-to-market plans per market, offer catalogue, ICPs, messaging, battlecards |
| `30-pricing/` | Price list exports, pricing guide, calculator source |
| `40-proposals/` | Proposal and one-pager templates, and customer proposals (one subfolder per customer) |
| `50-co-sell/` | Joint motions with Acronis and with channel partners, co-marketing plans, QBR template |
| `60-enablement/` | Certification plan, demo scripts, onboarding checklists, internal training |
| `90-templates/` | Reusable scripts and document skeletons |

## Working conventions

- Date-stamp decisions in `10-strategy/decisions-log.md`.
- Customer work goes in `40-proposals/<customer-slug>/`; never commit customer personal data.
- When a new Acronis calculator version arrives, re-run `90-templates/export-pricelist.py`
  and update the version string in `30-pricing/README.md` and here.
- Facts about Acronis (program, products, prices) change often. When a document relies on a
  fact older than one quarter, verify it against the Acronis partner portal before reuse.
