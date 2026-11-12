#!/usr/bin/env python3
"""Export the Acronis Cyber Cloud Calculator price list to CSV and JSON.

Usage:
    python3 export-pricelist.py <calculator.xlsx> <output-dir>

Reads the `Pricelist USD` and `Cloud DCs` sheets. Requires openpyxl.
Output file names carry the calculator version found in the source file name
(for example C26.09); adjust VERSION below if the file name has no version.
"""
import csv
import json
import re
import sys

import openpyxl


def clean(value):
    return re.sub(r"\s+", " ", str(value or "")).strip()


def main(src, out):
    match = re.search(r"C\d{2}\.\d{2}", src)
    version = match.group(0) if match else "latest"
    wb = openpyxl.load_workbook(src, data_only=True)

    ws = wb["Pricelist USD"]
    tiers = [int(ws.cell(2, c).value) for c in range(7, 15)]
    fix = {
        "Solution- based Licensing": "Solution-based licensing",
        "Service- based Licensing": "Service-based licensing",
    }
    rows, group, category = [], None, None
    for r in range(3, ws.max_row + 1):
        if ws.cell(r, 1).value:
            group = clean(ws.cell(r, 1).value)
        if ws.cell(r, 2).value:
            category = clean(ws.cell(r, 2).value)
        name = ws.cell(r, 4).value
        if not name:
            continue
        g = fix.get(group, group)
        rec = {
            "licensing_group": g,
            "category": category if g.endswith("licensing") else "",
            "dc_group": clean(ws.cell(r, 5).value),
            "sku": clean(ws.cell(r, 6).value),
            "sku_name": clean(name),
            "calculator_label": clean(ws.cell(r, 15).value),
        }
        for tier, c in zip(tiers, range(7, 15)):
            v = ws.cell(r, c).value
            rec[f"usd_{tier}"] = float(v) if v is not None else None
        rows.append(rec)

    base = f"{out}/acronis-pricelist-{version}-usd"
    with open(base + ".csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    with open(base + ".json", "w") as f:
        json.dump(
            {
                "source": f"Acronis Cyber Cloud Calculator {version} (USD)",
                "currency": "USD",
                "unit": "per unit per month, partner buy price",
                "commitment_tiers_usd_per_month": tiers,
                "skus": rows,
            },
            f,
            indent=1,
        )

    dc = wb["Cloud DCs"]
    dcs = []
    for r in range(3, dc.max_row + 1):
        if dc.cell(r, 1).value is None or clean(dc.cell(r, 2).value) != "Existing DC":
            continue
        dcs.append(
            {
                "group": clean(dc.cell(r, 3).value),
                "country": clean(dc.cell(r, 4).value),
                "dc": clean(dc.cell(r, 5).value),
                "geo_redundancy": dc.cell(r, 6).value == "Yes",
                "cyber_employee": dc.cell(r, 7).value == "Yes",
                "cyber_frame_cloud": dc.cell(r, 8).value == "Yes",
            }
        )
    with open(f"{out}/acronis-datacenters.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(dcs[0].keys()))
        w.writeheader()
        w.writerows(dcs)
    print(f"{len(rows)} SKUs and {len(dcs)} data centers exported to {out}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
