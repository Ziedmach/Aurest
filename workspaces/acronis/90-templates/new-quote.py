#!/usr/bin/env python3
"""Create a customer quote workbook from the quote model.

Usage:
    python3 new-quote.py --model 30-pricing/acronis-quote-model.xlsx --out 40-proposals/<slug>/quote.xlsx \
        --customer "Name" --ref NS-ACR-2026-003 --date 2026-11-12 --currency SAR --fx 3.75 --vat 0.15 \
        --tier 7000 --term 12 --line SRJAMSENS=50 --line SPFAMSENS=20 [--margin 0.20] \
        [--managed-fee 0] [--fixed-fee 0] [--onboarding 0]

Lines are SKU codes from the price list with quantities. --margin sets the per-line override
used by the Quote and Summary sheets (the Payment options sheet prices all three margins).
Recalculate the output with LibreOffice afterwards (see 30-pricing/README.md).
"""
import argparse
import shutil

import openpyxl


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--customer", required=True)
    ap.add_argument("--ref", required=True)
    ap.add_argument("--date", required=True)
    ap.add_argument("--currency", default="SAR")
    ap.add_argument("--fx", type=float, default=3.75)
    ap.add_argument("--vat", type=float, default=0.15)
    ap.add_argument("--tier", type=int, default=1000)
    ap.add_argument("--term", type=int, default=12)
    ap.add_argument("--line", action="append", required=True, help="SKU=QTY")
    ap.add_argument("--margin", type=float, default=None)
    ap.add_argument("--managed-fee", type=float, default=0)
    ap.add_argument("--fixed-fee", type=float, default=0)
    ap.add_argument("--onboarding", type=float, default=0)
    a = ap.parse_args()

    shutil.copyfile(a.model, a.out)
    wb = openpyxl.load_workbook(a.out)
    i, q, pl = wb["Inputs"], wb["Quote"], wb["Pricelist"]
    i["B10"], i["B11"], i["B12"] = a.customer, a.ref, a.date
    i["B13"], i["B14"], i["B15"], i["B16"], i["B17"] = a.currency, a.fx, a.vat, a.tier, a.term
    for r in range(1, 80):
        v = i.cell(r, 1).value
        if v and str(v).startswith("Managed service fee per protected workload"):
            i.cell(r, 2).value = a.managed_fee
            i.cell(r + 1, 2).value = a.fixed_fee
            i.cell(r + 2, 2).value = a.onboarding
            i.cell(r + 3, 2).value = 0
            i.cell(r + 4, 2).value = 0
    names = {pl.cell(r, 4).value: pl.cell(r, 5).value for r in range(5, pl.max_row + 1) if pl.cell(r, 4).value}
    for r in range(8, 38):
        for c in (2, 6, 10):
            q.cell(r, c).value = None
        q.cell(r, 2).comment = None
    for n, spec in enumerate(a.line):
        code, qty = spec.split("=")
        if code not in names:
            raise SystemExit(f"unknown SKU code {code}")
        r = 8 + n
        q.cell(r, 2).value = names[code]
        q.cell(r, 6).value = float(qty) if "." in qty else int(qty)
        if a.margin is not None:
            q.cell(r, 10).value = a.margin
    wb.save(a.out)
    print(f"wrote {a.out} with {len(a.line)} line(s); recalculate before use")


if __name__ == "__main__":
    main()
