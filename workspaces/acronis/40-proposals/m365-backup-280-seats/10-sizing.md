# Internal notes — Microsoft 365 backup, 280 seats

Request received 10 November 2026 as a photo of a customer bill-of-quantities line:
"Acronis email backup for Microsoft 365 seats (unlimited Acronis hosted cloud storage
included) - yearly subscription, qty 280". Customer name, country and data residency
requirement not yet known.

## SKU mapping

| Customer wording | Acronis SKU | Why |
|---|---|---|
| Email backup for Microsoft 365 seats, unlimited Acronis hosted storage | `SRJ2MSENS` Backup · Microsoft 365 seat (unlimited storage), G2 | Service-based per-seat SKU with unlimited Acronis-hosted storage. G2 because Abu Dhabi is the in-region data center for GCC customers. The seat SKU covers Exchange, OneDrive, SharePoint and Teams, not email only. |

Alternatives if the customer's situation differs:

| Alternative | SKU | Buy at tier 1,000 (USD per seat per month) |
|---|---|---|
| European data center (G1: Frankfurt, Strasbourg, etc.) | `SRJAMSENS` | 2.12 |
| Storage on Next Step cloud or customer Azure tenant (no Acronis storage) | `SRAAMSENS` plus storage per GB | 1.24 plus storage |
| Email archiving instead of (or in addition to) backup | `SHJ2MSENS` (G2) | 1.52 |

## Pricing basis used in `20-quote.md` and `quote.xlsx`

| Input | Value | Status |
|---|---|---|
| Price list | Acronis Cyber Cloud Calculator C26.09, USD | In force |
| Data center | Abu Dhabi (G2) | Assumption; confirm with the customer |
| Next Step commitment tier | 7,000 USD per month | Set by Zied, 10 November 2026 |
| Buy price | 2.27 USD per seat per month, 635.60 USD per month, 7,627.20 USD per year | From the list, tier 7,000 |
| Margin | By billing frequency: annual 20 percent, quarterly 30 percent, monthly 45 percent (gross margin on the sell price, sell = buy ÷ (1 − margin)) | Set by Zied, 10 November 2026; see the `Payment options` sheet in `quote.xlsx`; the Quote sheet line carries the annual option |
| FX | 3.75 SAR per USD | SAR peg |
| VAT | 15 percent | KSA |
| Managed service fee | 0 (included in the margin for this single-service deal) | Decision for this quote |
| Onboarding | 0 (tenant setup included) | Decision for this quote |

Result (SAR, 280 seats, buy 2.27 USD per seat per month at tier 7,000):

| Option | Margin | Unit sell per seat per month | Annual excl. VAT | Annual incl. VAT | Annual gross profit |
|---|---|---|---|---|---|
| A annual | 20 percent | 10.64 | 35,750.40 | 41,112.96 | 7,148.40 |
| B quarterly | 30 percent | 12.16 | 40,857.60 | 46,986.24 | 12,255.60 |
| C monthly | 45 percent | 15.48 | 52,012.80 | 59,814.72 | 23,410.80 |

Buy cost is 2,383.50 SAR per month (28,602 SAR per year) in every option. Acronis bills Next
Step monthly on consumption whatever the customer's billing frequency, so option A carries
the cash-flow benefit and options B and C carry the collection risk, which the higher margins
compensate.

## Sensitivity (annual, 280 seats, SAR excluding VAT)

| Data center | Tier | Margin 25 percent | Margin 35 percent | Margin 45 percent |
|---|---|---|---|---|
| Abu Dhabi (G2) | 250 | 54,096 | 62,429 | 73,752 |
| Abu Dhabi (G2) | 1,000 | 47,880 | 55,238 | 65,285 |
| **Abu Dhabi (G2)** | **7,000** | **38,136 (20 percent: 35,750)** | **43,938** | **51,927** |
| Europe (G1) | 250 | 40,320 | 46,536 | 54,970 |
| Europe (G1) | 1,000 | 35,616 | 41,093 | 48,552 |
| Next Step or Azure storage (seat licence only) | 1,000 | 20,832 | 24,024 | 28,392 |

Buy cost of this deal alone by tier (USD per month): 901.60 at tier 250; 856.80 at 500;
798.00 at 1,000; 719.60 at 2,000; 660.80 at 4,000.

## Before sending

1. Confirm the customer name, country and whether data must stay in-Kingdom. If
   in-Kingdom is required, switch to `SRAAMSENS` with Next Step hosted storage and re-price.
2. Tier 7,000 and the three billing-frequency margins applied (10 November 2026). Revisit if the margin policy lands elsewhere.
3. Confirm whether the customer wants email only (consider email archiving) or full
   Microsoft 365 protection (the quoted SKU).
4. Decide whether to show the geo-redundant and archiving options with prices.
