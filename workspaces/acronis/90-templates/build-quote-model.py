#!/usr/bin/env python3
"""Build the Next Step Acronis quote model workbook from the exported price list.

Usage:
    python3 build-quote-model.py <pricelist.json> <output.xlsx>

After building, recalculate the workbook with LibreOffice (see 30-pricing/README.md)
so every formula carries a cached value before the file is shared.
"""
import csv
import json
import os
import re
import sys

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

FONT = "Arial"
EMERALD = "014737"
PALE = "EAF2EE"
INPUT_BLUE = "0000FF"
YELLOW = "FFFF00"

TIERS = [250, 500, 1000, 2000, 4000, 7000, 10000, 15000]
QUOTE_LINES = 30
QUOTE_FIRST = 8
QUOTE_LAST = QUOTE_FIRST + QUOTE_LINES - 1

MARGIN_FAMILIES = [
    ("Bundles", 0.35, "Solution-based bundles: Security + RMM, Backup + DR, Ultimate Protection and their add-ons"),
    ("Security", 0.40, "EDR, XDR, MDR, email and collaboration security, awareness training, DLP, GenAI Protection"),
    ("Backup & DR", 0.35, "Per-workload backup, disaster recovery, email archiving, files sync and share"),
    ("Storage", 0.25, "Per-GB storage, geo-redundancy, compute points, public IPs"),
    ("Operations", 0.30, "RMM and PSA"),
    ("Infrastructure", 0.20, "Cyber Frame, Cyber Infrastructure, Cyber Workspace"),
    ("Other", 0.10, "Pass-through services such as physical data shipping"),
]

# Pricelist sheet layout (1-based columns)
PL_GROUP, PL_CAT, PL_DC, PL_CODE, PL_NAME, PL_FULL, PL_FAMILY = 1, 2, 3, 4, 5, 6, 7
PL_TIER0 = 8  # first tier price column (H); tiers occupy H..O
PL_SELECTED = PL_TIER0 + len(TIERS)  # P
PL_HEADER_ROW, PL_TIER_ROW, PL_FIRST = 3, 4, 5


def display_name(name):
    """Shorter, unique SKU label for dropdowns and customer-facing lines."""
    n = re.sub(r"\s*-\s*Acronis Cyber (Protect|Files) Cloud\s*\d?$", "", name)
    reps = [
        ("Solution-based Licensing - ", "SBL · "), ("Solution-based licensing - ", "SBL · "),
        ("(with unlimited Acronis Hosted Cloud storage1)", "(unlimited storage)"),
        ("(unlimited Acronis Hosted Cloud Storage included1)", "(unlimited storage)"),
        ("(unlimited Acronis Hosted Cloud storage1)", "(unlimited storage)"),
        ("of Acronis Hosted Storage included", "storage included"),
        ("Managed Detection and Response (MDR)", "MDR"), ("Managed Detection and Response", "MDR"),
        ("Acronis Hosted Storage", "Acronis storage"), ("Acronis Hosted", "Acronis hosted"),
        (" - WL - ", " · "), (" - GB - ", " (per GB) · "), ("storage1", "storage"),
        ("for per Workload model", "per-workload model"), ("for per GB model", "per-GB model"),
        ("(for SP/Customer/Azure/Google Hosted storage)", "(partner/Azure/Google storage)"),
        ("(for SP/Azure/Google Hosted storage)", "(partner/Azure/Google storage)"),
        ("(for SP/Azure/Google Hosted storag", "(partner/Azure/Google storage"),
        ("Ultimate Protection", "Ultimate"), ("per month3", "per month"),
        ("Public Floating IPv4, allocated IP addresses", "Public IPv4"),
    ]
    for a, b in reps:
        n = n.replace(a, b)
    return re.sub(r"\s+", " ", n).strip(" -")


def margin_family(sku):
    group, cat, name = sku["licensing_group"], sku["category"], sku["sku_name"].lower()
    storage_words = ("per gb", "compute point", "public ip", "geo-redundant")  # not the bare word "storage": seat SKUs with included storage are workloads
    if group == "Solution-based licensing":
        if cat in ("Additional Storage", "Geo-Replication", "Disaster Recovery Infrastructure"):
            return "Storage"
        return "Bundles"
    if group == "Service-based licensing":
        if cat in ("Endpoint Security", "M365 and SaaS Security", "Security Awareness Training"):
            return "Security"
        if cat in ("Remote Monitoring and Management", "Professional Services Automation"):
            return "Operations"
        if any(w in name for w in storage_words):
            return "Storage"
        return "Backup & DR"
    if group in ("Cyber Frame", "Cyber Infrastructure", "Cyber Workspace"):
        return "Infrastructure"
    if group == "Files Sync & Share":
        return "Storage" if any(w in name for w in storage_words) else "Backup & DR"
    return "Other"


def style_header(ws, row, first_col, last_col):
    for c in range(first_col, last_col + 1):
        cell = ws.cell(row, c)
        cell.font = Font(name=FONT, bold=True, color="FFFFFF", size=10)
        cell.fill = PatternFill("solid", fgColor=EMERALD)
        cell.alignment = Alignment(vertical="center", wrap_text=True)


def set_font(ws):
    for row in ws.iter_rows():
        for cell in row:
            f = cell.font
            cell.font = Font(name=FONT, size=f.size or 10, bold=f.bold, color=f.color, italic=f.italic)


def input_cell(ws, ref, value, fmt=None, key=False):
    cell = ws[ref]
    cell.value = value
    cell.font = Font(name=FONT, size=10, color=INPUT_BLUE)
    if key:
        cell.fill = PatternFill("solid", fgColor=YELLOW)
    if fmt:
        cell.number_format = fmt
    return cell


def label(ws, ref, text, bold=False, italic=False, size=10):
    cell = ws[ref]
    cell.value = text
    cell.font = Font(name=FONT, size=size, bold=bold, italic=italic)
    return cell


def title(ws, ref, text):
    cell = ws[ref]
    cell.value = text
    cell.font = Font(name=FONT, size=14, bold=True, color=EMERALD)


def main(src, out):
    data = json.load(open(src))
    skus = data["skus"]
    for s in skus:
        s["display"] = display_name(s["sku_name"])
    assert len({s["display"] for s in skus}) == len(skus), "display names must be unique"
    n = len(skus)
    PL_LAST = PL_FIRST + n - 1
    thin = Side(style="thin", color="BFC5C9")
    box = Border(top=thin, bottom=thin, left=thin, right=thin)

    def pl_col(c):
        return get_column_letter(c)

    name_rng = f"Pricelist!${pl_col(PL_NAME)}${PL_FIRST}:${pl_col(PL_NAME)}${PL_LAST}"

    def pl_range(c):
        return f"Pricelist!${pl_col(c)}${PL_FIRST}:${pl_col(c)}${PL_LAST}"

    tier_hdr = f"Pricelist!${pl_col(PL_TIER0)}${PL_TIER_ROW}:${pl_col(PL_TIER0 + len(TIERS) - 1)}${PL_TIER_ROW}"

    wb = Workbook()

    # ------------------------------------------------------------------ Inputs
    ws = wb.active
    ws.title = "Inputs"
    title(ws, "A1", "Next Step Middle East — Acronis quote model")
    label(ws, "A2", f"Price list: {data['source']}. Buy prices are Acronis list to partner, USD per unit per month.")
    label(ws, "A4", "Legend", bold=True)
    c = label(ws, "A5", "Blue text on yellow = key inputs to set for every quote")
    c.font = Font(name=FONT, size=10, color=INPUT_BLUE)
    c.fill = PatternFill("solid", fgColor=YELLOW)
    c = label(ws, "A6", "Blue text = inputs and assumptions you may change")
    c.font = Font(name=FONT, size=10, color=INPUT_BLUE)
    label(ws, "A7", "Black = formulas. Do not overwrite.")

    label(ws, "A9", "Quote settings", bold=True)
    rows = [
        ("Customer name", "B10", "Example Trading Co. (illustrative)", None, True),
        ("Proposal reference", "B11", "NS-ACR-2026-001", None, False),
        ("Proposal date", "B12", "2026-10-01", None, False),
        ("Currency code", "B13", "SAR", None, True),
        ("FX rate: local currency per 1 USD", "B14", 3.75, "0.0000", True),
        ("VAT rate", "B15", 0.15, "0.0%", True),
        ("Next Step commitment tier (USD per month)", "B16", 1000, "#,##0", True),
        ("Contract term (months)", "B17", 12, "0", False),
        ("Validity (days)", "B18", 90, "0", False),
        ("Rounding of unit sell price (decimals)", "B19", 2, "0", False),
    ]
    for r, (text, ref, val, fmt, key) in enumerate(rows, start=10):
        label(ws, f"A{r}", text)
        input_cell(ws, ref, val, fmt, key)
    ws["B14"].comment = Comment("Source: user-entered reference rate. SAR is pegged at 3.75 per USD; set TND, EUR, RWF or other rates on the proposal date and state the rate in the proposal.", "Next Step")
    ws["B16"].comment = Comment("The tier is a Next Step portfolio decision, not a per-customer one. All customers under the Next Step tenant buy at the same tier. See 30-pricing/README.md.", "Next Step")
    dv_tier = DataValidation(type="list", formula1='"' + ",".join(str(t) for t in TIERS) + '"', allow_blank=False)
    ws.add_data_validation(dv_tier)
    dv_tier.add("B16")
    dv_cur = DataValidation(type="list", formula1='"SAR,TND,LYD,MRU,RWF,EUR,USD,XOF,MAD,DZD"', allow_blank=False)
    ws.add_data_validation(dv_cur)
    dv_cur.add("B13")

    label(ws, "A21", "Margin assumptions by SKU family (gross margin on Acronis buy price)", bold=True)
    label(ws, "A22", "These defaults are placeholders pending the Next Step margin policy decision (decisions-log.md, 2026-10-01). Change them here; every quote line uses them unless overridden.", italic=True, size=9)
    for i, h in enumerate(["Margin family", "Default margin %", "Covers"], start=1):
        ws.cell(23, i, h)
    style_header(ws, 23, 1, 3)
    MF_FIRST = 24
    for i, (fam, pct, desc) in enumerate(MARGIN_FAMILIES):
        r = MF_FIRST + i
        label(ws, f"A{r}", fam)
        input_cell(ws, f"B{r}", pct, "0.0%")
        label(ws, f"C{r}", desc)
    MF_LAST = MF_FIRST + len(MARGIN_FAMILIES) - 1

    label(ws, f"A{MF_LAST + 2}", "Service fees (local currency)", bold=True)
    SF = MF_LAST + 3
    label(ws, f"A{SF}", "Managed service fee per protected workload per month")
    input_cell(ws, f"B{SF}", 15, "#,##0.00", True)
    ws[f"B{SF}"].comment = Comment("Assumption: Next Step operations, monitoring, restore tests and monthly reporting, priced per protected workload or seat. Set to 0 if the service is built into the margin instead.", "Next Step")
    label(ws, f"A{SF + 1}", "Fixed managed service fee per month")
    input_cell(ws, f"B{SF + 1}", 0, "#,##0.00")
    label(ws, f"A{SF + 2}", "Onboarding and migration (one-time)")
    input_cell(ws, f"B{SF + 2}", 7500, "#,##0.00")
    label(ws, f"A{SF + 3}", "DR runbook and first failover test (one-time)")
    input_cell(ws, f"B{SF + 3}", 0, "#,##0.00")
    label(ws, f"A{SF + 4}", "Training (one-time)")
    input_cell(ws, f"B{SF + 4}", 0, "#,##0.00")

    label(ws, f"A{SF + 6}", "Notes", bold=True)
    notes = [
        "1. Buy prices come from the Pricelist sheet (C26.09 USD). Replace that sheet when Acronis publishes a new list.",
        "2. Unit sell (USD) = unit buy / (1 - margin). Unit sell (local) = unit sell (USD) x FX rate, rounded.",
        "3. Storage-bearing SKUs exist in G1 and G2 variants; choose the SKU that matches the data center in the proposal.",
        "4. The Tier analysis sheet shows this quote's buy cost at every commitment tier.",
        "5. Nothing in this workbook is customer-facing except the Summary sheet.",
    ]
    for i, t in enumerate(notes):
        label(ws, f"A{SF + 7 + i}", t)
    ws.column_dimensions["A"].width = 52
    ws.column_dimensions["B"].width = 34
    ws.column_dimensions["C"].width = 90

    # --------------------------------------------------------------- Pricelist
    pl = wb.create_sheet("Pricelist")
    title(pl, "A1", "Acronis price list — partner buy prices, USD per unit per month")
    label(pl, "A2", f"Source: {data['source']}. The last column picks the price for the tier chosen in Inputs!B16.")
    heads = ["Licensing group", "Category", "DC group", "SKU code", "SKU (short name, used in dropdowns)", "Full Acronis SKU name", "Margin family"] + [f"Tier {t:,}" for t in TIERS] + ["Price at selected tier"]
    for i, h in enumerate(heads, start=1):
        pl.cell(PL_HEADER_ROW, i, h)
    style_header(pl, PL_HEADER_ROW, 1, len(heads))
    pl.row_dimensions[PL_HEADER_ROW].height = 30
    label(pl, f"{pl_col(PL_FAMILY)}{PL_TIER_ROW}", "Commitment USD/month →", bold=True)
    for j, t in enumerate(TIERS):
        c = pl.cell(PL_TIER_ROW, PL_TIER0 + j, t)
        c.number_format = "#,##0"
        c.font = Font(name=FONT, size=10, bold=True)
    for i, s in enumerate(skus):
        r = PL_FIRST + i
        pl.cell(r, PL_GROUP, s["licensing_group"])
        pl.cell(r, PL_CAT, s["category"])
        pl.cell(r, PL_DC, s["dc_group"])
        pl.cell(r, PL_CODE, s["sku"])
        pl.cell(r, PL_NAME, s["display"])
        pl.cell(r, PL_FULL, s["sku_name"])
        pl.cell(r, PL_FAMILY, margin_family(s))
        for j, t in enumerate(TIERS):
            c = pl.cell(r, PL_TIER0 + j, s[f"usd_{t}"])
            c.number_format = "#,##0.0000"
        first, last = pl_col(PL_TIER0), pl_col(PL_TIER0 + len(TIERS) - 1)
        c = pl.cell(r, PL_SELECTED, f"=INDEX(${first}{r}:${last}{r},1,MATCH(Inputs!$B$16,${first}${PL_TIER_ROW}:${last}${PL_TIER_ROW},0))")
        c.number_format = "#,##0.0000"
    widths = [24, 30, 9, 12, 70, 95, 14] + [11] * len(TIERS) + [16]
    for i, w in enumerate(widths, start=1):
        pl.column_dimensions[get_column_letter(i)].width = w
    pl.freeze_panes = f"{pl_col(PL_FULL)}{PL_FIRST}"
    pl.auto_filter.ref = f"A{PL_HEADER_ROW}:{pl_col(PL_SELECTED)}{PL_LAST}"

    # ------------------------------------------------------------------- Quote
    q = wb.create_sheet("Quote")
    title(q, "B1", "Quote builder (internal)")
    label(q, "B2", "Customer")
    q["C2"] = "=Inputs!B10"
    label(q, "B3", "Currency / FX rate / commitment tier")
    q["C3"] = "=Inputs!B13"
    q["D3"] = "=Inputs!B14"
    q["D3"].number_format = "0.0000"
    q["E3"] = "=Inputs!B16"
    q["E3"].number_format = "#,##0"
    label(q, "B5", "Pick a SKU from the dropdown in column B and enter the quantity in column F. Override the margin in column J only when the deal needs it.", italic=True, size=9)
    heads = ["#", "SKU (short name)", "SKU code", "Category", "DC group", "Quantity", "Unit buy (USD)",
             "Margin family", "Default margin", "Margin override", "Margin used", "Unit sell (USD)",
             "Unit sell (local)", "Monthly buy (USD)", "Monthly sell (local)", "Annual sell (local)"]
    for i, h in enumerate(heads, start=1):
        q.cell(7, i, h)
    style_header(q, 7, 1, len(heads))
    q.row_dimensions[7].height = 32

    dv_sku = DataValidation(type="list", formula1=f"={name_rng}", allow_blank=True)
    dv_sku.error = "Pick a SKU from the Pricelist sheet."
    q.add_data_validation(dv_sku)
    for r in range(QUOTE_FIRST, QUOTE_LAST + 1):
        q.cell(r, 1, r - QUOTE_FIRST + 1)
        b = q.cell(r, 2)
        b.font = Font(name=FONT, size=10, color=INPUT_BLUE)
        b.alignment = Alignment(wrap_text=True, vertical="center")
        dv_sku.add(b)
        m = f"MATCH($B{r},{name_rng},0)"
        q.cell(r, 3, f'=IF($B{r}="","",INDEX({pl_range(PL_CODE)},{m}))')
        q.cell(r, 4, f'=IF($B{r}="","",INDEX({pl_range(PL_CAT)},{m}))')
        q.cell(r, 5, f'=IF($B{r}="","",INDEX({pl_range(PL_DC)},{m}))')
        f = q.cell(r, 6)
        f.font = Font(name=FONT, size=10, color=INPUT_BLUE)
        f.number_format = "#,##0"
        q.cell(r, 7, f'=IF($B{r}="","",INDEX({pl_range(PL_SELECTED)},{m}))').number_format = "#,##0.0000"
        q.cell(r, 8, f'=IF($B{r}="","",INDEX({pl_range(PL_FAMILY)},{m}))')
        q.cell(r, 9, f'=IF($B{r}="","",INDEX(Inputs!$B${MF_FIRST}:$B${MF_LAST},MATCH($H{r},Inputs!$A${MF_FIRST}:$A${MF_LAST},0)))').number_format = "0.0%"
        j = q.cell(r, 10)
        j.font = Font(name=FONT, size=10, color=INPUT_BLUE)
        j.number_format = "0.0%"
        q.cell(r, 11, f'=IF($B{r}="","",IF($J{r}="",$I{r},$J{r}))').number_format = "0.0%"
        q.cell(r, 12, f'=IF($B{r}="","",IF($K{r}>=1,"margin must be below 100%",$G{r}/(1-$K{r})))').number_format = "#,##0.0000"
        q.cell(r, 13, f'=IF($B{r}="","",ROUND($L{r}*Inputs!$B$14,Inputs!$B$19))').number_format = "#,##0.0000"
        q.cell(r, 14, f'=IF($B{r}="","",$F{r}*$G{r})').number_format = "#,##0.00"
        q.cell(r, 15, f'=IF($B{r}="","",$F{r}*$M{r})').number_format = "#,##0.00"
        q.cell(r, 16, f'=IF($B{r}="","",$O{r}*12)').number_format = "#,##0.00"
        q.row_dimensions[r].height = 27
        for c in range(1, 17):
            cell = q.cell(r, c)
            cell.border = box
            if c != 2:
                cell.alignment = Alignment(vertical="center")

    T = QUOTE_LAST + 2
    label(q, f"B{T}", "Totals", bold=True)
    lines = [
        ("Platform subtotal, monthly buy (USD)", f"=SUM(N{QUOTE_FIRST}:N{QUOTE_LAST})", "#,##0.00"),
        ("Platform subtotal, monthly buy (local)", f"=C{T+1}*Inputs!B14", "#,##0.00"),
        ("Platform subtotal, monthly sell (local)", f"=SUM(O{QUOTE_FIRST}:O{QUOTE_LAST})", "#,##0.00"),
        ("Protected workloads and seats (excludes storage lines)", f'=SUMIFS(F{QUOTE_FIRST}:F{QUOTE_LAST},H{QUOTE_FIRST}:H{QUOTE_LAST},"<>Storage",H{QUOTE_FIRST}:H{QUOTE_LAST},"<>Infrastructure",H{QUOTE_FIRST}:H{QUOTE_LAST},"<>Other")', "#,##0"),
        ("Managed service fee, monthly (local)", f"=C{T+4}*Inputs!B{SF}+Inputs!B{SF+1}", "#,##0.00"),
        ("Monthly total excluding VAT (local)", f"=C{T+3}+C{T+5}", "#,##0.00"),
        ("VAT (local)", f"=C{T+6}*Inputs!B15", "#,##0.00"),
        ("Monthly total including VAT (local)", f"=C{T+6}+C{T+7}", "#,##0.00"),
        ("Annual total excluding VAT (local)", f"=C{T+6}*12", "#,##0.00"),
        ("Contract value excluding VAT (local)", f"=C{T+6}*Inputs!B17", "#,##0.00"),
        ("One-time services excluding VAT (local)", f"=Inputs!B{SF+2}+Inputs!B{SF+3}+Inputs!B{SF+4}", "#,##0.00"),
        ("Monthly gross profit on platform (local)", f"=C{T+3}-C{T+2}", "#,##0.00"),
        ("Blended platform margin", f"=IF(C{T+3}=0,0,C{T+12}/C{T+3})", "0.0%"),
        ("Monthly gross profit including managed service (local)", f"=C{T+12}+C{T+5}", "#,##0.00"),
    ]
    for i, (text, formula, fmt) in enumerate(lines, start=1):
        bold = text.startswith(("Monthly total", "Annual", "Contract"))
        label(q, f"B{T+i}", text, bold=bold)
        c = q[f"C{T+i}"]
        c.value = formula
        c.number_format = fmt
        c.font = Font(name=FONT, size=10, bold=bold)
    label(q, f"B{T+16}", "Gross profit here is sell minus Acronis buy; it excludes Next Step delivery cost and the difference between the commitment tier and actual portfolio consumption.", italic=True, size=9)

    widths = [4, 64, 14, 26, 9, 10, 14, 14, 12, 12, 12, 14, 14, 16, 18, 18]
    for i, w in enumerate(widths, start=1):
        q.column_dimensions[get_column_letter(i)].width = w
    q.freeze_panes = "C8"

    # Example quote: Scenario A from 30-pricing/README.md (Saudi SMB, Ultimate Protection, Abu Dhabi G2)
    example = [("SUPHMSENS", 2), ("SUPJMSENS", 25), ("SUPKMSENS", 30), ("SBSTFNLOS", 30)]
    by_code = {s["sku"]: s["display"] for s in skus}
    for i, (code, qty) in enumerate(example):
        q.cell(QUOTE_FIRST + i, 2, by_code[code])
        q.cell(QUOTE_FIRST + i, 6, qty)
    q.cell(QUOTE_FIRST, 2).comment = Comment("Example rows: Scenario A from the pricing guide (2 servers, 25 workstations, 30 Microsoft 365 seats, 30 awareness-training users on Ultimate Protection, Abu Dhabi G2). Replace with the customer's quantities.", "Next Step")

    # --------------------------------------------------------- Payment options
    po = wb.create_sheet("Payment options")
    title(po, "B1", "Payment options — same scope, margin by billing frequency")
    label(po, "B2", "Each quote line is priced three ways from the same buy price. Margins are blue inputs (gross margin on the sell price: sell = buy / (1 - margin)). Quantities and buy prices come from the Quote sheet; FX, VAT and rounding from Inputs.", italic=True, size=9)
    label(po, "B4", "Option", bold=True); label(po, "C4", "Billing", bold=True); label(po, "D4", "Margin", bold=True); label(po, "E4", "Months per period", bold=True)
    PO_OPTS = [("A", "Annual, paid in advance", 0.20, 12), ("B", "Quarterly, paid in advance", 0.30, 3), ("C", "Monthly, paid in advance", 0.40, 1)]
    for i, (o, billing, mg, months) in enumerate(PO_OPTS):
        r = 5 + i
        label(po, f"B{r}", o); label(po, f"C{r}", billing)
        input_cell(po, f"D{r}", mg, "0%")
        input_cell(po, f"E{r}", months, "0")
    heads = ["#", "SKU (short name)", "Quantity", "Unit buy (USD)",
             "A unit sell (local)", "A monthly (local)", "B unit sell (local)", "B monthly (local)", "C unit sell (local)", "C monthly (local)"]
    PO_HDR = 9
    for i, h in enumerate(heads, start=1):
        po.cell(PO_HDR, i, h)
    style_header(po, PO_HDR, 1, len(heads))
    po.row_dimensions[PO_HDR].height = 30
    PO_FIRST = PO_HDR + 1
    for i in range(QUOTE_LINES):
        r = PO_FIRST + i
        qr = QUOTE_FIRST + i
        po.cell(r, 1, i + 1)
        po.cell(r, 2, f'=IF(Quote!B{qr}="","",Quote!B{qr})').alignment = Alignment(wrap_text=True, vertical="center")
        po.cell(r, 3, f'=IF(Quote!B{qr}="","",Quote!F{qr})').number_format = "#,##0"
        po.cell(r, 4, f'=IF(Quote!B{qr}="","",Quote!G{qr})').number_format = "#,##0.0000"
        for j in range(3):
            mrow = 5 + j
            ucol, mcol = 5 + 2 * j, 6 + 2 * j
            po.cell(r, ucol, f'=IF(Quote!B{qr}="","",ROUND($D{r}/(1-$D${mrow})*Inputs!$B$14,Inputs!$B$19))').number_format = "#,##0.00"
            po.cell(r, mcol, f'=IF(Quote!B{qr}="","",$C{r}*{get_column_letter(ucol)}{r})').number_format = "#,##0.00"
        for c in range(1, len(heads) + 1):
            if c != 2:
                po.cell(r, c).alignment = Alignment(vertical="center")
        po.row_dimensions[r].height = 27
    PO_LAST = PO_FIRST + QUOTE_LINES - 1
    S = PO_LAST + 2
    sheads = ["", "Option", "Billing", "Margin", "Monthly excl. VAT (local)", "Per billing period excl. VAT (local)", "VAT per period (local)", "Per billing period incl. VAT (local)", "Annual excl. VAT (local)", "Annual incl. VAT (local)", "Annual gross profit (local)"]
    for i, h in enumerate(sheads, start=1):
        po.cell(S, i, h)
    style_header(po, S, 2, len(sheads))
    po.row_dimensions[S].height = 42
    for j, (o, billing, mg, months) in enumerate(PO_OPTS):
        r = S + 1 + j
        mcol = get_column_letter(6 + 2 * j)
        label(po, f"B{r}", o, bold=True); label(po, f"C{r}", billing)
        po[f"D{r}"] = f"=D{5 + j}"; po[f"D{r}"].number_format = "0%"
        po[f"E{r}"] = f"=SUM({mcol}{PO_FIRST}:{mcol}{PO_LAST})"
        po[f"F{r}"] = f"=E{r}*E{5 + j}"
        po[f"G{r}"] = f"=F{r}*Inputs!$B$15"
        po[f"H{r}"] = f"=F{r}+G{r}"
        po[f"I{r}"] = f"=E{r}*12"
        po[f"J{r}"] = f"=I{r}*(1+Inputs!$B$15)"
        po[f"K{r}"] = f"=I{r}-Quote!$C${T + 1}*Inputs!$B$14*12"
        for col in "EFGHIJK":
            po[f"{col}{r}"].number_format = "#,##0.00"
    label(po, f"B{S + 5}", "Gross profit is annual sell minus Acronis buy at the selected tier; it excludes delivery cost and any managed-service fee, which is not part of these options.", italic=True, size=9)
    for col, w in zip("ABCDEFGHIJK", [4, 56, 26, 14, 18, 20, 18, 20, 18, 18, 18]):
        po.column_dimensions[col].width = w
    po.freeze_panes = f"C{PO_FIRST}"

    # ----------------------------------------------------------- Tier analysis
    ta = wb.create_sheet("Tier analysis")
    title(ta, "B1", "This quote's Acronis buy cost at every commitment tier (USD per month)")
    label(ta, "B2", "Shows what the same quantities cost Next Step at each tier. The tier applies to the whole Next Step portfolio; use this to judge whether a deal justifies moving up a tier.", italic=True, size=9)
    heads = ["#", "SKU (short name)", "Quantity"] + [f"Tier {t:,}" for t in TIERS]
    for i, h in enumerate(heads, start=1):
        ta.cell(4, i, h)
    style_header(ta, 4, 1, len(heads))
    for j, t in enumerate(TIERS):
        ta.cell(5, 4 + j, t).number_format = "#,##0"
        ta.cell(5, 4 + j).font = Font(name=FONT, size=10, bold=True)
    label(ta, "C5", "Commitment →", bold=True)
    TA_FIRST = 6
    for i in range(QUOTE_LINES):
        r = TA_FIRST + i
        qr = QUOTE_FIRST + i
        ta.cell(r, 1, i + 1)
        ta.cell(r, 2, f"=Quote!B{qr}").alignment = Alignment(wrap_text=True, vertical="center")
        ta.cell(r, 3, f'=IF(Quote!B{qr}="","",Quote!F{qr})').number_format = "#,##0"
        for j in range(len(TIERS)):
            c = ta.cell(r, 4 + j, f'=IF(Quote!$B{qr}="",0,Quote!$F{qr}*INDEX({pl_range(PL_TIER0 + j)},MATCH(Quote!$B{qr},{name_rng},0)))')
            c.number_format = "#,##0.00"
        for c in range(1, 4 + len(TIERS)):
            if c != 2:
                ta.cell(r, c).alignment = Alignment(vertical="center")
        ta.row_dimensions[r].height = 27
    TA_LAST = TA_FIRST + QUOTE_LINES - 1
    R = TA_LAST + 1
    last_tier_col = get_column_letter(3 + len(TIERS))
    sel = f"INDEX($D${R}:${last_tier_col}${R},1,MATCH(Inputs!$B$16,$D$5:${last_tier_col}$5,0))"
    label(ta, f"B{R}", "Monthly buy cost of this quote (USD)", bold=True)
    label(ta, f"B{R+1}", "Saving versus selected tier (USD per month)")
    label(ta, f"B{R+2}", "Saving versus selected tier (%)")
    label(ta, f"B{R+3}", "Selected tier?")
    for j in range(len(TIERS)):
        col = get_column_letter(4 + j)
        c = ta[f"{col}{R}"]
        c.value = f"=SUM({col}{TA_FIRST}:{col}{TA_LAST})"
        c.number_format = "#,##0.00"
        c.font = Font(name=FONT, size=10, bold=True)
        ta[f"{col}{R+1}"] = f"={sel}-{col}{R}"
        ta[f"{col}{R+1}"].number_format = "#,##0.00;(#,##0.00);-"
        ta[f"{col}{R+2}"] = f"=IF({sel}=0,0,{col}{R+1}/{sel})"
        ta[f"{col}{R+2}"].number_format = "0.0%;(0.0%);-"
        ta[f"{col}{R+3}"] = f'=IF({col}5=Inputs!$B$16,"selected","")'
    ta.column_dimensions["A"].width = 4
    ta.column_dimensions["B"].width = 64
    ta.column_dimensions["C"].width = 14
    for j in range(len(TIERS)):
        ta.column_dimensions[get_column_letter(4 + j)].width = 13
    ta.freeze_panes = "D6"

    # ----------------------------------------------------------------- Summary
    sm = wb.create_sheet("Summary")
    title(sm, "A1", "Commercial summary — for the proposal")
    sm["A2"] = "=\"Prepared for \"&Inputs!B10&\" · Reference \"&Inputs!B11&\" · \"&Inputs!B12"
    sm["A3"] = "=\"Currency \"&Inputs!B13&\" · USD reference rate \"&TEXT(Inputs!B14,\"0.0000\")&\" · VAT \"&TEXT(Inputs!B15,\"0%\")&\" shown separately · Valid \"&Inputs!B18&\" days\""
    heads = ["Line", "Quantity", "Unit price per month", "Monthly total"]
    for i, h in enumerate(heads, start=1):
        sm.cell(5, i, h)
    style_header(sm, 5, 1, 4)
    SM_FIRST = 6
    for i in range(QUOTE_LINES):
        r = SM_FIRST + i
        qr = QUOTE_FIRST + i
        sm.cell(r, 1, f'=IF(Quote!B{qr}="","",Quote!B{qr})').alignment = Alignment(wrap_text=True, vertical="center")
        sm.cell(r, 2, f'=IF(Quote!B{qr}="","",Quote!F{qr})').number_format = "#,##0"
        sm.cell(r, 3, f'=IF(Quote!B{qr}="","",Quote!M{qr})').number_format = "#,##0.00"
        sm.cell(r, 4, f'=IF(Quote!B{qr}="","",Quote!O{qr})').number_format = "#,##0.00"
        for c in (2, 3, 4):
            sm.cell(r, c).alignment = Alignment(vertical="center")
        sm.row_dimensions[r].height = 27
    SM_LAST = SM_FIRST + QUOTE_LINES - 1
    S = SM_LAST + 1
    label(sm, f"A{S}", "Managed service: operations, monitoring, restore tests, monthly report")
    sm[f"B{S}"] = f"=Quote!C{T+4}"
    sm[f"B{S}"].number_format = "#,##0"
    sm[f"C{S}"] = f"=IF(Quote!C{T+4}=0,0,Quote!C{T+5}/Quote!C{T+4})"
    sm[f"C{S}"].number_format = "#,##0.00"
    sm[f"D{S}"] = f"=Quote!C{T+5}"
    sm[f"D{S}"].number_format = "#,##0.00"
    totals = [
        ("Monthly subtotal excluding VAT", f"=Quote!C{T+6}"),
        ("VAT", f"=Quote!C{T+7}"),
        ("Monthly total including VAT", f"=Quote!C{T+8}"),
        ("Annual equivalent excluding VAT", f"=Quote!C{T+9}"),
        ("One-time services excluding VAT", f"=Quote!C{T+11}"),
    ]
    for i, (text, formula) in enumerate(totals, start=1):
        label(sm, f"A{S+i}", text, bold=True)
        c = sm[f"D{S+i}"]
        c.value = formula
        c.number_format = "#,##0.00"
        c.font = Font(name=FONT, size=10, bold=True)
    label(sm, f"A{S+7}", "Prices are per unit per month in the stated currency, billed monthly in advance, quantities reconciled quarterly, storage beyond included quotas billed per GB per month as listed.", italic=True, size=9)
    sm.column_dimensions["A"].width = 72
    sm.column_dimensions["B"].width = 12
    sm.column_dimensions["C"].width = 22
    sm.column_dimensions["D"].width = 18

    # -------------------------------------------------------------- Datacenters
    dc = wb.create_sheet("Data centers")
    title(dc, "A1", "Acronis data centers and storage groups (from the calculator)")
    heads = ["Group", "Country", "Data center", "Geo-redundancy", "Cyber Employee", "Cyber Frame Cloud"]
    for i, h in enumerate(heads, start=1):
        dc.cell(3, i, h)
    style_header(dc, 3, 1, 6)
    dcs_path = os.path.join(os.path.dirname(src), "acronis-datacenters.csv")
    with open(dcs_path) as f:
        for i, row in enumerate(csv.DictReader(f)):
            r = 4 + i
            dc.cell(r, 1, row["group"])
            dc.cell(r, 2, row["country"])
            dc.cell(r, 3, row["dc"])
            dc.cell(r, 4, "Yes" if row["geo_redundancy"] == "True" else "")
            dc.cell(r, 5, "Yes" if row["cyber_employee"] == "True" else "")
            dc.cell(r, 6, "Yes" if row["cyber_frame_cloud"] == "True" else "")
    for i, w in enumerate([8, 18, 18, 15, 15, 17], start=1):
        dc.column_dimensions[get_column_letter(i)].width = w

    for sheet in wb.worksheets:
        set_font(sheet)
        sheet.sheet_view.showGridLines = sheet.title in ("Pricelist", "Quote", "Tier analysis")
    wb.save(out)
    print(f"Wrote {out}: {n} SKUs, {QUOTE_LINES} quote lines")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
