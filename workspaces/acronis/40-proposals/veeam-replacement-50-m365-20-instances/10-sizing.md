# Internal notes — Veeam replacement, 50 Microsoft 365 users and 20 instances

Request received 12 November 2026 from Munawar Khan by WhatsApp: a photo of the customer's
Veeam renewal bill of quantities, with the message "they want to replace Veeam and I want to
give Acronis". Customer name, country and environment details not yet known.

## Veeam lines and Acronis mapping

| Veeam line (as photographed) | Qty | What it is | Acronis SKU proposed | Qty | Buy at tier 7,000 (USD per unit per month) |
|---|---|---|---|---|---|
| Data Cloud for Microsoft 365 Flex 1-50 users, 1-year renewal, upfront billing, Production (24/7) support | 50 | Veeam's SaaS backup for Microsoft 365, storage included | `SRJAMSENS` Backup · Microsoft 365 seat (unlimited storage), G1 | 50 | 1.69 |
| Data Platform Advanced Universal Subscription Licence, Enterprise Plus features, 1-year renewal, 24/7 support, 10-instance pack | 2 | 20 Veeam Universal Licence instances. One instance covers one VM, one physical server or cloud VM; workstations and NAS consume fractions. Customer provides the backup repository | `SPFAMSENS` Backup · VM (per workload) | 20 | 5.36 |

Assumption to confirm: the 20 instances are virtual machines. If some are physical servers,
use `SPEAMSENS` Backup · Server (15.22 USD at tier 7,000; 71.34 SAR per month at option A)
for those. If some are workstations, `SPGAMSENS` (2.50 USD) is far cheaper per unit.

Storage: Veeam Data Platform writes to the customer's own repository, and the Acronis
per-workload model also includes backups to the customer's local storage at no charge, so no
storage line is quoted for the VMs. An off-site copy to Acronis cloud (`SPDAMSENS`, G1
per-workload-model storage, 0.0218 USD per GB at tier 7,000; 0.10 SAR per GB per month at 20
percent margin) is listed as an option; it is the natural upsell since Veeam gives them no
cloud copy without a separate repository.

Support: Veeam "Production 24/7" support maps to Next Step service desk with 24/7 handling of
priority-1 incidents plus Acronis partner support; stated as such in the quotation.

## Pricing basis (same logic as NS-ACR-2026-002)

| Input | Value |
|---|---|
| Price list | Acronis Cyber Cloud Calculator C26.09, USD |
| Data center | G1 European region, location to be fixed at tenant creation; quotation shows [Frankfurt, Germany] in brackets |
| Next Step commitment tier | 7,000 USD per month |
| Margins | Annual 20 percent, quarterly 30 percent, monthly 40 percent (gross margin on the sell price) |
| FX | 3.75 SAR per USD |
| VAT | 15 percent |
| Managed service fee, onboarding | 0, included in the margin |

Buy cost: 191.70 USD per month (84.50 for the seats, 107.20 for the VMs), 718.88 SAR per
month, 8,626.50 SAR per year.

| Option | Margin | Monthly excl. VAT | Annual excl. VAT | Annual incl. VAT | Annual gross profit |
|---|---|---|---|---|---|
| A annual | 20 percent | 898.60 | 10,783.20 | 12,400.68 | 2,156.70 |
| B quarterly | 30 percent | 1,026.70 | 12,320.40 | 14,168.46 | 3,693.90 |
| C monthly | 40 percent | 1,198.00 | 14,376.00 | 16,532.40 | 5,749.50 |

## Selling points against the Veeam renewal

- One agent and one console for Microsoft 365 and the VMs, with endpoint security and MDR
  available on the same agent later.
- Unlimited cloud storage for Microsoft 365 included; Veeam Data Cloud Flex caps storage per
  user tier.
- Off-site cloud copy of the VMs for 0.10 SAR per GB per month, without building a second
  repository.
- Operated service with tested restores and monthly reports, not a licence renewal.

Honest gaps to prepare for: Veeam has deeper VMware integration and instant VM recovery on
local hardware; Acronis full-VM restores from cloud are slower. Keep the backups local (as
quoted) and offer disaster recovery as the answer to RTO questions.

## Before sending

1. Confirm the customer name and country, and that a European data center is acceptable for
   the Microsoft 365 data; otherwise switch to `SRJ2MSENS` (Abu Dhabi).
2. Confirm the split of the 20 instances (VMs, physical servers, workstations) and the
   hypervisor; reprice physical servers if any.
3. Confirm the existing backup storage capacity and whether an off-site copy is wanted; if
   so, estimate the GB and add the storage line.
4. Fix the G1 data center location and replace the bracket in `20-quote.md`.
5. Ask Munawar for the Veeam renewal price if he has it; it sets the ceiling.
