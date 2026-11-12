# Ideal customer profiles and personas

## Ideal customer profiles

| ICP | Firmographics | Signals | Disqualifiers |
|---|---|---|---|
| **A. Regulated mid-market (Saudi)** | 250 to 3,000 users; banking, insurance, capital markets, healthcare, large retail; Riyadh, Jeddah, Dammam | Recent NCA ECC, SAMA or CMA assessment with resilience or endpoint findings; Microsoft 365 without backup; no 24/7 detection; DR never tested | Group-mandated enterprise stack with an in-house SOC and Veeam or Commvault already tested and audited (sell coexistence only) |
| **B. SME under NCA segment frameworks (Saudi)** | 20 to 250 users; professional services, trading, construction, clinics, education; any Saudi city | Needs to show basic hygiene and reporting; one IT person or outsourced IT; Microsoft 365 Business; ransomware worry | Fewer than 10 users; no Microsoft 365 or servers; price-only buyer with no compliance driver |
| **C. Financial institutions and public bodies (Africa)** | Banks, microfinance, insurers, central-bank-supervised entities, ministries, utilities in Tunisia, Libya, Mauritania, Rwanda | Regulator requirement for DR; data must stay in the country; existing Next Step relationship | No budget authority in-country; hard currency restrictions without a local-currency route |
| **D. MSPs, IT resellers, telecoms (both regions)** | 5 to 200 staff; manage 20+ SME customers; sell Microsoft 365 or connectivity | Looking for a recurring line; lost a customer to ransomware; asked by customers for backup | Already operate their own Acronis or competitor tenant with a direct contract; unwilling to sign a partner agreement |

## Personas

| Persona | Goals | Fears | What convinces them | Our evidence |
|---|---|---|---|---|
| CISO (A, C) | Pass the audit, survive ransomware, show the board coverage | Untested restores, unknown dwell time, vendor sprawl | Control mapping, tested restore reports, MDR with 15-minute remediation target | Compliance alignment table, restore test report sample, MITRE and AV-TEST results |
| CIO or IT director (A, B, C) | Fewer tools, less staff load, predictable spend | Migration pain, console complexity, vendor lock-in | One agent, we operate it, monthly fee, exit terms | Onboarding plan, service levels, reference call |
| CFO or procurement (A, C) | Opex, local currency, VAT clarity, exit | Hidden storage costs, currency exposure | Transparent per-unit pricing, overage line, USD reference rate fixed for the term | Proposal section 5 structure |
| Compliance or GRC lead (A, C) | Evidence on demand | Missing documentation at audit time | Monthly report, evidence pack, Cyber Compliance roadmap | Report sample |
| SME owner or office manager (B) | Not to lose the business to an attack; no IT headaches | Cost, complexity | One price per user, we handle everything, monthly report for the regulator | One-pager, 15-minute demo |
| MSP owner (D) | Margin, speed to market, support behind them | Being undercut, platform ownership | White-label in 30 days, wholesale pricing, Next Step tier-2 support, co-marketing | Partner pack, wholesale price list, onboarding playbook |

## Qualification questions

1. Which regulator or framework applies, and when is the next audit or assessment?
2. How many servers, VMs, workstations and Microsoft 365 seats, and how much data?
3. When was the last full restore or failover tested, and what happened?
4. Where must the data reside?
5. What is protected today, by whom, and when does the contract end?
6. Who signs, and what is the budget cycle?
