# Acronis pricing reference (partner buy prices)

Source: `source/Acronis_Cyber_Cloud_Calculator_C26.09_USD.xlsx`, the Acronis Cyber Cloud
Calculator, price list version **C26.09**, currency **USD**. All prices are **what Next Step
pays Acronis per unit per month** under the service-provider (Cyber Protect Cloud) model.
Customer prices are set by Next Step on top of these, using the quote model
`acronis-quote-model.xlsx` (section 5 below). The margin percentages in the model are
placeholders until the margin policy is decided.

Files in this folder:

| File | What it is |
|---|---|
| `acronis-pricelist-C26.09-usd.csv` / `.json` | All 119 SKUs with the 8 commitment-tier prices, flattened from the `Pricelist USD` sheet |
| `acronis-datacenters.csv` | The 39 Acronis data centers with their storage group (G1/G2) and feature availability |
| `acronis-quote-model.xlsx` | The quote model: inputs, price list, quote builder, tier analysis, customer-facing summary (section 5) |
| `source/…xlsx` | The original calculator. Keep it untouched. Replace it when Acronis publishes a new version and re-run the export (script in `../90-templates/export-pricelist.py`) |

## 1. How Acronis Cyber Protect Cloud pricing works

**Monthly commitment tiers.** Next Step commits to a minimum monthly spend with Acronis.
The higher the commitment, the lower every unit price. There are 8 tiers:

| Tier | Minimum monthly commitment (USD) |
|---|---|
| 1 | 250 |
| 2 | 500 |
| 3 | 1,000 |
| 4 | 2,000 |
| 5 | 4,000 |
| 6 | 7,000 |
| 7 | 10,000 |
| 8 | 15,000 |

The commitment is billed even if consumption is lower. Consumption above the commitment is
billed at the same tier's unit prices. The tier is a portfolio decision for Next Step, not
a per-customer one: all customers under the Next Step tenant draw from the same tier.

**Data center groups.** Acronis-hosted storage SKUs have two price groups:

- **G1**: most data centers (USA, Europe, Japan, Singapore, Australia, Canada, India, Turkey,
  Brazil, and others). Lower storage prices.
- **G2**: **Abu Dhabi (UAE)**, **Johannesburg (South Africa)** and Taipei. Roughly 20 to 25
  percent higher on storage-bearing SKUs.

There is **no Acronis data center in Saudi Arabia** in this list. For Saudi customers the
in-region choice is Abu Dhabi (G2). For sub-Saharan Africa it is Johannesburg (G2). For
North Africa the nearest G1 options are Frankfurt, Strasbourg, Valencia, Rome and Istanbul.
Where data must stay in-Kingdom (NCA CCC, sector regulators), the model is **Service Provider
hosted storage**: Next Step hosts the storage (own cloud or a Saudi partner data center) and
pays only the per-workload or per-GB "Partner Storage" SKUs, which have no G1/G2 uplift.

**Two licensing models**, selectable per customer tenant:

### Solution-based licensing (bundles)

Pre-packaged per-workload bundles. Storage is included in the per-workload price up to a
quota (fair-usage policy), extra storage is billed per GB.

| Bundle | What is inside | Workload SKUs |
|---|---|---|
| **Security + RMM** | EDR-class endpoint security plus remote monitoring and management; Microsoft 365 and Google Workspace security seats | Endpoint, M365 seat, Google seat (all DCs) |
| **Backup + DR (BDR)** | Backup with disaster recovery; server includes 3 TB hosted storage, VM 2 TB, workstation 300 GB, M365 and Google seats unlimited storage, mobile 50 GB | Server, VM, Workstation, M365 seat, Google seat, Mobile; G1 and G2 variants |
| **Ultimate Protection** | Everything in Security + RMM and Backup + DR together | Server, VM, Workstation, M365 seat, Google seat; G1 and G2 variants |

Add-ons for solution-based tenants: Managed Detection and Response (MDR, by Acronis TRU or
third party, Standard or Advanced, partner-level or customer-level), Security Awareness
Training per user, additional hosted storage per GB, geo-redundancy, disaster-recovery
compute points and public IPs.

### Service-based licensing (à la carte)

Each service is priced on its own and can be combined freely. Storage is always billed
separately (per GB, Acronis-hosted G1/G2, Azure or Google hosted, Partner hosted, or
Customer storage).

Service families and their entry prices at tier 1 (USD per unit per month):

| Family | Example SKU | Tier 1 | Tier 4 (2,000) | Tier 8 (15,000) |
|---|---|---|---|---|
| Endpoint security | EDR per workload | 1.20 | 0.89 | 0.68 |
| Endpoint security | XDR per workload | 1.80 | 1.33 | 1.01 |
| Endpoint security | MDR by Acronis TRU, partner-level Standard | 1.90 | 1.65 | 1.45 |
| Endpoint security | MDR by Acronis TRU, customer-level Advanced | 3.70 | 3.30 | 2.90 |
| Endpoint security | GenAI Protection per workload | 1.00 | 0.84 | 0.68 |
| Endpoint security | Data Loss Prevention per endpoint | 2.50 | 1.93 | 1.59 |
| SaaS security | Email Security per user | 2.40 | 2.15 | 1.84 |
| SaaS security | Collaboration Security for M365 per user | 1.30 | 1.16 | 1.00 |
| SaaS security | Security Posture Management per M365 seat | 1.20 | 1.07 | 0.92 |
| Awareness | Security Awareness Training per user | 1.40 | 1.12 | 0.93 |
| RMM | RMM per endpoint | 1.90 | 1.36 | 1.01 |
| PSA | PSA per user (3 minimum) | 50.00 | 44.00 | 39.00 |
| Backup | Server per workload (no storage) | 25.00 | 17.61 | 14.03 |
| Backup | VM per workload (no storage) | 8.80 | 6.20 | 4.94 |
| Backup | Workstation per workload (no storage) | 4.10 | 2.89 | 2.30 |
| Backup | M365 seat, unlimited Acronis storage, G2 | 3.22 | 2.57 | 2.14 |
| Backup | M365 seat, unlimited Acronis storage, G1 | 2.40 | 1.91 | 1.59 |
| Backup | M365 seat on partner/Azure/Google storage | 1.45 | 1.05 | 0.74 |
| Backup | Entra ID seat, unlimited Acronis storage | 0.60 | 0.49 | 0.40 |
| Storage | Acronis hosted, per-workload model, per GB, G2 | 0.0546 | 0.0360 | 0.0258 |
| Storage | Acronis hosted, per-GB model, per GB, G2 | 0.14 | 0.0964 | 0.0776 |
| Storage | Partner (Next Step) hosted, per GB | 0.077 | 0.0531 | 0.0428 |
| Storage | Customer storage, per GB | 0.065 | 0.0449 | 0.0361 |
| Storage | Microsoft 365 Backup Storage powered by Microsoft, per GB | 0.124 | 0.0986 | 0.0819 |
| Disaster recovery | Acronis hosted DR storage per GB, G2 | 0.087 | 0.0599 | 0.0461 |
| Disaster recovery | Compute point per running hour | 0.06 | 0.0462 | 0.038 |
| Disaster recovery | Public IP | 3.00 | 2.31 | 1.90 |
| Disaster recovery | DR and Direct Backup to Azure per workload | 14.00 | 10.90 | 9.06 |
| Email archiving | M365 seat, unlimited Acronis storage, G2 | 1.70 | 1.40 | 1.176 |
| Cyber Frame | Local, per physical CPU core | 10.50 | 9.00 | 6.50 |
| Cyber Frame | Cloud vCPU per month | 9.22 | 7.90 | 5.71 |
| Cyber Workspace | Cyber Employee agent | 12.00 | 11.20 | 10.24 |
| Files Sync & Share | Per user | 1.70 | 1.12 | 0.85 |
| Cyber Infrastructure | SPLA per GB | 0.015 | 0.0104 | 0.0083 |
| Services | Physical data shipping, one disk | 99 (flat) | 99 | 99 |

Full table with every tier: `acronis-pricelist-C26.09-usd.csv`.

### Disaster recovery compute points

The calculator's `Compute points` sheet maps server templates to compute points per hour:
1 vCore/2 GB = 1, 1 vCore/4 GB = 2, 2 vCore/8 GB = 4, 4 vCore/16 GB = 8, 8 vCore/32 GB = 16,
16 vCore/64 GB = 32, 16 vCore/128 GB = 64, 16 vCore/256 GB = 128. Monthly test cost =
points per hour × servers × tests per month × hours per test × compute point price. For an
actual failover, multiply by 24 hours × expected days of downtime (calculator default 7 days).

## 2. Worked cost scenarios (Acronis buy price, before Next Step margin)

All figures from the C26.09 USD list. Quantities are illustrative.

**Scenario A, Saudi SMB on Ultimate Protection, Abu Dhabi (G2).**
2 servers, 25 workstations, 30 Microsoft 365 seats, 30 Security Awareness Training users.

| Tier | Monthly buy cost |
|---|---|
| 1 (250) | 907.00 |
| 3 (1,000) | 788.14 |

**Scenario B, mid-market service-based, Abu Dhabi (G2), tier 4 (2,000).**
10 servers and 40 VMs backup, 250 XDR workloads, 200 M365 backup seats (unlimited storage),
200 Email Security users, 4 TB additional per-workload storage.
Monthly buy cost: **1,844.60**.

**Scenario C, MSP reseller starter on Security + RMM, G1, tier 2 (500).**
100 endpoints Security + RMM, 100 workstation backups, 100 M365 backup seats.
Monthly buy cost: **861.00**.

**Server protection, three ways (G2, per server per month).**

| Tier | BDR bundle (3 TB included) | Service-based backup + 3 TB per-workload storage | Ultimate Protection (3 TB included) |
|---|---|---|---|
| 1 | 81.50 | 192.73 | 87.50 |
| 3 | 69.74 | 151.27 | 74.87 |
| 5 | 57.75 | 105.55 | 64.01 |

Takeaway: for servers that actually hold terabytes, the solution-based bundles are far
cheaper than service-based plus storage. Service-based wins when storage per workload is
small, when the customer or Next Step hosts the storage, or when the customer wants a single
service (for example XDR only, or M365 backup only).

## 3. Rules of thumb for Next Step quoting

1. Pick the tenant model per customer: bundles for "protect everything" SMB deals, service-based
   for single-service deals and for storage-heavy customers hosted on Next Step storage.
2. Quote in the customer's currency (SAR, TND, XOF, EUR) with a stated USD reference rate and a
   validity window. Acronis bills Next Step in USD.
3. Always state the data center and residency option in the proposal (Abu Dhabi G2,
   Johannesburg G2, European G1, or Next Step hosted).
4. Storage growth is the margin risk: include a per-GB overage line in every proposal.
5. Keep MDR as a named upsell line, not bundled silently; it is the highest-value service line.
6. The tier is a Next Step decision. Model the portfolio each quarter: when committed
   consumption is approaching the next tier, moving up usually pays for itself.

## 5. The quote model (`acronis-quote-model.xlsx`)

Built by `../90-templates/build-quote-model.py` from the JSON export. Six sheets:

| Sheet | Purpose |
|---|---|
| `Inputs` | Customer, reference, date, currency, FX rate (local per USD), VAT, Next Step commitment tier, term, validity, rounding. Margin defaults by SKU family. Managed-service and one-time fees. Blue cells are inputs; yellow cells are the ones to set for every quote. |
| `Pricelist` | All 119 SKUs with the 8 tier prices and a "price at selected tier" column that follows the tier chosen in Inputs. Replace this sheet (or rebuild the file) when a new calculator version arrives. |
| `Quote` | Up to 30 lines. Pick the SKU name from the dropdown, enter the quantity, optionally override the margin. Each line shows buy price, margin, unit sell in USD and local currency, monthly buy, monthly sell and annual sell. Totals block adds the managed-service fee, VAT, annual and contract values, gross profit and blended margin. |
| `Tier analysis` | The same quantities costed at every commitment tier, with the saving versus the selected tier. Use it to judge whether a deal justifies moving the portfolio up a tier. |
| `Summary` | Customer-facing lines and totals in the quote currency, ready to paste into section 5 of the proposal template. |
| `Data centers` | Reference list of Acronis data centers and storage groups. |

How a sell price is formed: unit sell (USD) = unit buy ÷ (1 − margin); unit sell (local) =
unit sell (USD) × FX rate, rounded to the decimals set in Inputs. Margin is therefore gross
margin on the sell price, not a markup on cost. A 35 percent margin equals a 54 percent markup.

Margin families and placeholder defaults (to be replaced by the margin policy): Bundles 35
percent, Security 40, Backup & DR 35, Storage 25, Operations 30, Infrastructure 20, Other 10.
The managed-service fee defaults to 15 per protected workload per month in the quote
currency, plus an optional fixed fee; onboarding defaults to 7,500 one-time. All are inputs.

The file ships with the Scenario A example (Saudi SMB, Ultimate Protection, Abu Dhabi G2,
tier 1,000, SAR at 3.75, VAT 15 percent) in the first four quote lines. Overwrite them.

Rebuild after a price-list change:

```bash
python3 workspaces/acronis/90-templates/build-quote-model.py workspaces/acronis/30-pricing/acronis-pricelist-<version>-usd.json workspaces/acronis/30-pricing/acronis-quote-model.xlsx
```

then open the file in Excel or LibreOffice once so every formula is recalculated before
sharing it.

## 6. Refreshing this reference

When Acronis publishes a new calculator version, drop it into `source/`, update the version
in the file names, and run:

```bash
python3 workspaces/acronis/90-templates/export-pricelist.py <path-to-xlsx> workspaces/acronis/30-pricing
```

Then re-check the scenario numbers in section 2.
