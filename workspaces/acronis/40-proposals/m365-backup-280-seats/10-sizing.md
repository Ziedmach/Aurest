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
| Next Step commitment tier | 1,000 USD per month | Assumption; confirm Next Step's actual tier |
| Buy price | 2.85 USD per seat per month, 798 USD per month, 9,576 USD per year | From the list |
| Margin | 35 percent (Backup & DR placeholder) | Placeholder; margin policy not yet decided |
| FX | 3.75 SAR per USD | SAR peg |
| VAT | 15 percent | KSA |
| Managed service fee | 0 (included in the margin for this single-service deal) | Decision for this quote |
| Onboarding | 0 (tenant setup included) | Decision for this quote |

Result: 16.44 SAR per seat per month; 4,603.20 SAR per month; 55,238.40 SAR per year
excluding VAT; 63,524.16 SAR per year including VAT. Gross profit about 1,610.70 SAR per
month (19,328 SAR per year) before delivery cost.

## Sensitivity (annual, 280 seats, SAR excluding VAT)

| Data center | Tier | Margin 25 percent | Margin 35 percent | Margin 45 percent |
|---|---|---|---|---|
| Abu Dhabi (G2) | 250 | 54,096 | 62,429 | 73,752 |
| Abu Dhabi (G2) | 1,000 | 47,880 | 55,238 | 65,285 |
| Europe (G1) | 250 | 40,320 | 46,536 | 54,970 |
| Europe (G1) | 1,000 | 35,616 | 41,093 | 48,552 |
| Next Step or Azure storage (seat licence only) | 1,000 | 20,832 | 24,024 | 28,392 |

Buy cost of this deal alone by tier (USD per month): 901.60 at tier 250; 856.80 at 500;
798.00 at 1,000; 719.60 at 2,000; 660.80 at 4,000.

## Before sending

1. Confirm the customer name, country and whether data must stay in-Kingdom. If
   in-Kingdom is required, switch to `SRAAMSENS` with Next Step hosted storage and re-price.
2. Confirm Next Step's commitment tier and the margin to apply; update `Inputs` in
   `quote.xlsx`, and transfer the figures to `20-quote.md`.
3. Confirm whether the customer wants email only (consider email archiving) or full
   Microsoft 365 protection (the quoted SKU).
4. Decide whether to show the geo-redundant and archiving options with prices.
