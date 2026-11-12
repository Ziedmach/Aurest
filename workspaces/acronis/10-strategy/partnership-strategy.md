# Acronis partnership strategy — Next Step Middle East

Version 0.1, 1 October 2026. Draft for review by Zied. Decisions are logged in
`decisions-log.md`; facts are in `../00-context/`.

## 1. Why Acronis, why now

Next Step sells cybersecurity, cloud and managed services to regulated organisations across
Saudi Arabia and Africa, and already carries Veeam and Commvault for enterprise data
protection and Fortinet, Sophos and Secureworks for security. What the portfolio lacks is a
**single, consumption-billed platform that Next Step can operate for SMB, mid-market and
channel customers**: backup, disaster recovery, Microsoft 365 protection and endpoint
security with 24/7 managed detection, under Next Step's brand, with data placed where the
regulator wants it.

Acronis Cyber Protect Cloud is that platform. It is partner-only, multi-tenant, white-label,
billed monthly on consumption, and in 2026 it added MDR by Acronis TRU, GenAI Protection,
Cyber Compliance and Cyber Frame IaaS. It has data centers in Abu Dhabi and Johannesburg and
a Dubai-based regional team.

The partnership therefore does three things for Next Step:

1. **Creates a recurring managed-services line** with gross margin set by Next Step, not by
   hardware resale, improving the revenue mix (services were 34 to 40 percent of revenue
   in Tunisia).
2. **Monetises the compliance funnel.** Every NCA ECC, SAMA or CMA assessment surfaces
   backup, recovery and endpoint gaps (ECC domains 2 and 3). Acronis is the remediation
   product for those gaps at SMB and mid-market scale, where Veeam and Commvault are too
   heavy.
3. **Opens a channel business.** Next Step can host sub-partner tenants for MSPs and IT
   resellers in Saudi Arabia, Tunisia, Libya, Mauritania and Rwanda, acting as the regional
   service-provider layer with pre-sales, tier-2 support and local-currency billing.

## 2. Partnership model

| Decision | Choice | Rationale |
|---|---|---|
| Commercial route | Service provider by default; reseller via distributor on request | Recurring revenue, control of data placement and support; tenders sometimes require licence ownership |
| Tenant design | One Next Step partner tenant; sub-partner tenants per country and per channel partner; customer tenants under them | Clean billing, local-currency invoicing, country reporting |
| Data placement | Abu Dhabi (G2) for GCC; Johannesburg (G2) for southern and eastern Africa; Frankfurt or Strasbourg (G1) for Europe and North Africa where allowed; Next Step sovereign cloud (Tunisia, Libya, Rwanda, in-Kingdom partner DC) where residency requires | Residency is the first question in every regulated deal |
| Licensing mode | Ultimate Protection or Backup + DR for "protect everything" SMB; service-based for single-service and storage-heavy deals | See `../30-pricing/README.md` section 2 |
| Commitment tier | Start at the tier that covers the first signed customers plus NFR usage; review quarterly | Tier is a portfolio decision; moving up pays once consumption nears the next threshold |
| Service wrap | Every Acronis sale is sold as a Next Step managed service with onboarding, monitoring, restore testing, reporting and service levels | This is where margin and differentiation sit; the platform alone is a commodity |
| Target tier in program | Gold within 12 months | Unlocks rebates, MDF, dedicated account manager |

## 3. Where Acronis sits in the Next Step portfolio

| Next Step pillar | Acronis role | Existing vendors it complements |
|---|---|---|
| Cybersecurity & GRC | Endpoint EDR/XDR with MDR by Acronis TRU for customers without a SOC; Security Awareness Training; Email Security; Cyber Compliance evidence | Fortinet, Sophos, Secureworks (enterprise SOC remains with them) |
| Cloud & Datacenter | Backup, DR as a service, Microsoft 365 protection, Archival Storage, Cyber Frame for hosted IaaS | Veeam and Commvault stay for large enterprise data centers; Acronis for SMB, mid-market, branches, M365, and Next Step's own cloud |
| Managed Services | The operating platform for Next Step's BaaS, DRaaS and managed endpoint services; RMM and PSA for managed IT customers | Existing NOC/SOC tooling |
| Saudi "Tamkeen to Riyada" journey | Mana'a (resilience) stage first; Himaya (defense) second | Veeam, Commvault, Fortinet, Sophos already mapped there |

## 4. Markets and segments

**Saudi Arabia first.** Demand drivers: NCA ECC-2:2024 domain 3 (resilience) and domain 2
(defense), SAMA CSF, CMA, PDPL, and the move of SMEs into NCA's segment frameworks. Route to
market: the Compliance-to-Pipeline motion with GO Telecom, direct mid-market sales from
Riyadh, Etimad tenders where licence resale applies, and an MSP channel for SMEs.
Residency: Abu Dhabi for most private-sector customers; Next Step hosted storage for
customers requiring in-Kingdom data.

**Africa second, in parallel from Tunis.** Tunisia and Libya direct (own cloud in both),
Mauritania and francophone West Africa through Nouakchott, Rwanda and East Africa through
Kigali. Demand drivers: central bank and telecom regulator requirements, ransomware
exposure, lack of tested backups, Microsoft 365 adoption. Residency: Next Step cloud or
Johannesburg. Billing in local currency against a USD reference rate.

| Segment | What we sell | How we sell |
|---|---|---|
| SMB end customers (20 to 250 users) | Ultimate Protection or Backup + DR plus M365 protection, as a per-user monthly managed service | Inside sales, partner referrals, compliance assessments, Microsoft CSP cross-sell |
| MSPs and IT resellers | Sub-partner tenant under Next Step, white-label, wholesale pricing, pre-sales and tier-2 support, onboarding playbook | Partner recruitment programme, partner pack, quarterly enablement |
| Mid-market and enterprise (250 to 5,000 users) | Service-based: M365 backup, XDR with MDR, DRaaS for critical servers, email security, archiving; coexistence with Veeam or Commvault | Account-based selling, compliance mapping, tenders |

## 5. Revenue logic

Guidance: fill with the business case once the first tier and margin policy are agreed.

- Unit of sale: protected workload or user per month.
- Revenue per customer = Acronis buy cost + Next Step margin + managed-service fee.
- Portfolio view: committed tier (cost floor) versus billed consumption (revenue); the gap
  closes as customers onboard. Keep NFR and internal usage inside the committed amount.
- Leading indicators: assessments run, proposals issued, tenants created, workloads
  protected, storage under management, MDR seats.

Targets for the first 12 months are set in `90-day-plan.md` (first 90 days) and should be
extended to a 12-month plan after the first quarter's data.

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| No Saudi data center; residency objections | Next Step hosted storage (partner storage SKUs), Abu Dhabi for private sector, clear residency statement in every proposal |
| Storage growth erodes margin | Per-GB overage line in every contract; quarterly reconciliation; bundles for storage-heavy servers |
| Channel conflict with Veeam and Commvault relationships | Explicit segmentation (section 3); coexistence messaging |
| Console complexity and support delays hurt the customer experience | Next Step operates the console; certified engineers; escalation path agreed with Acronis; NFR lab |
| Partner tier and discounts lower than assumed | Confirm with the channel manager before pricing the first proposals; price with a safety margin |
| Commitment tier billed above consumption in the first months | Start at the lowest tier that fits; onboard NFR and internal workloads first |
| Currency risk (USD cost, local-currency revenue) | USD reference rate fixed per proposal with a validity window; annual repricing clause |

## 7. Governance

- Executive sponsor: Zied. Partnership owner: to be named. Technical lead: to be named.
- Monthly internal review of pipeline, consumption versus tier, and onboarding backlog.
- Quarterly business review with Acronis (template in `../50-co-sell/qbr-template.md`).
- Decisions recorded in `decisions-log.md`.
