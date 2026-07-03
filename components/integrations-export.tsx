"use client";

import { useState } from "react";
import { AlertTriangle, Check, Copy, Download, FileArchive, FileText, Link2, MessageCircle, RefreshCcw, Save, Send, ShieldCheck, Trash2, Upload, Webhook } from "lucide-react";
import { brochureExtractionSample, buildCsvPreview, exportTypes, extractionConfidence, importErrorRecords, portalSources, webhookEvents, type ExportType, type PortalSource, type WebhookEvent } from "@/lib/integrations-billing";

type Tab = "CSV export" | "PDF extraction" | "Import errors" | "CRM webhook" | "WhatsApp Business" | "Portal imports";
type ImportErrorStatus = "Needs review" | "Retry queued" | "Ignored";

export function IntegrationsExport({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState<Tab>("CSV export");
  return <div className="module-stack integrations-epic">
    <section className="integrations-hero"><div><span><Link2 />IMPORT, EXPORT & EXTRACTION</span><h2>Clean exports, brochure extraction and import-error review</h2><p>Frontend workflow for moving allowed workspace data out, extracting structured property data, and reviewing failed records before retry.</p></div><button className="primary-button" onClick={() => notify("Integration health checked")}>Check status</button></section>
    <div className="integrations-tabs">{(["CSV export", "PDF extraction", "Import errors", "CRM webhook", "WhatsApp Business", "Portal imports"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{iconForTab(item)}{item}</button>)}</div>
    {tab === "CSV export" && <CsvExport notify={notify} />}
    {tab === "PDF extraction" && <PdfExtraction notify={notify} />}
    {tab === "Import errors" && <ImportErrorReview notify={notify} />}
    {tab === "CRM webhook" && <WebhookExport notify={notify} />}
    {tab === "WhatsApp Business" && <WhatsAppIntegration notify={notify} />}
    {tab === "Portal imports" && <PortalImports notify={notify} />}
  </div>;
}

function CsvExport({ notify }: { notify: (message: string) => void }) {
  const [type, setType] = useState<ExportType>("Buyer profiles");
  const [range, setRange] = useState("This month");
  const [roleScope, setRoleScope] = useState("My allowed data");
  const preview = buildCsvPreview(type);
  return <div className="csv-export-layout"><section className="export-config-card"><h3>CSV export</h3><p>Exports respect workspace role, date range, and data visibility. Export actions are logged locally in this prototype.</p><label>Export type<select value={type} onChange={(event) => setType(event.target.value as ExportType)}>{exportTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Date range<select value={range} onChange={(event) => setRange(event.target.value)}><option>Today</option><option>Last 7 days</option><option>This month</option><option>This quarter</option><option>Custom range</option></select></label><label>Permission scope<select value={roleScope} onChange={(event) => setRoleScope(event.target.value)}><option>My allowed data</option><option>Assigned team data</option><option>Workspace admin export</option></select></label><div className="permission-note"><ShieldCheck />Allowed data only · scoped to current workspace · clean readable headers</div><button className="primary-button" onClick={() => notify(`${type} CSV export prepared for ${range} and logged`)}><Download />Download CSV</button></section><section className="csv-preview-card"><header><span>CSV PREVIEW · {roleScope}</span><button onClick={() => { navigator.clipboard?.writeText(preview); notify("CSV preview copied"); }}><Copy />Copy</button></header><pre>{preview}</pre><div className="export-audit-strip"><Check />Audit log: export requested by current user · {type} · {range}</div></section></div>;
}

function WebhookExport({ notify }: { notify: (message: string) => void }) {
  const [enabled, setEnabled] = useState(true);
  const [events, setEvents] = useState<WebhookEvent[]>(["Buyer created", "Report generated"]);
  const [url, setUrl] = useState("https://crm.example.com/webhooks/dpi");
  function toggle(event: WebhookEvent) { setEvents((all) => all.includes(event) ? all.filter((item) => item !== event) : [...all, event]); }
  return <div className="webhook-layout"><section className="webhook-config-card"><h3>CRM webhook export</h3><p>Admin configures events, tests delivery, and can disable webhook anytime.</p><label>Webhook URL<input value={url} onChange={(event) => setUrl(event.target.value)} /></label><div className="webhook-events">{webhookEvents.map((event) => <label key={event}><input type="checkbox" checked={events.includes(event)} onChange={() => toggle(event)} />{event}</label>)}</div><button className={enabled ? "toggle on" : "toggle"} onClick={() => setEnabled(!enabled)}><i /></button><span className="webhook-enabled">{enabled ? "Webhook enabled" : "Webhook disabled"}</span><div className="form-actions"><button className="ghost-button" onClick={() => notify("Webhook test sent: 200 OK")}>Test webhook</button><button className="primary-button" onClick={() => notify("Webhook settings saved")}>Save webhook</button></div></section><section className="webhook-log-card"><h3>Failed events log</h3>{[{ event: "Buyer status changed", reason: "CRM timeout", time: "Today · 10:14" }, { event: "Property shortlisted", reason: "401 invalid token", time: "Yesterday" }].map((item) => <article key={item.time}><AlertTriangle /><span><strong>{item.event}</strong><small>{item.reason} · {item.time}</small></span><button onClick={() => notify("Webhook event retry queued")}><RefreshCcw />Retry</button></article>)}</section></div>;
}

function WhatsAppIntegration({ notify }: { notify: (message: string) => void }) {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("Hi Omar, I found a fresh Marina option that fits your saved search. Want me to send the short report?");
  return <div className="whatsapp-layout"><section className="whatsapp-card"><MessageCircle /><h3>WhatsApp Business</h3><p>Connect WhatsApp Business, send generated messages, track delivery status, and link conversations to buyer profiles.</p><button className={connected ? "connected" : ""} onClick={() => { setConnected(!connected); notify(connected ? "WhatsApp disconnected" : "WhatsApp Business connected in demo mode"); }}>{connected ? "Connected" : "Connect WhatsApp Business"}</button></section><section className="whatsapp-send-card"><h3>Send generated message</h3><label>Buyer conversation<select><option>Omar Al Mansoori</option><option>Sarah Ahmed</option><option>James Liu</option></select></label><textarea value={message} onChange={(event) => setMessage(event.target.value)} /><div className="delivery-row"><span><Check />Linked to buyer profile</span><span><Check />Delivery status: ready</span></div><button className="primary-button" disabled={!connected} onClick={() => notify("WhatsApp message sent · delivery pending")}><Send />Send from platform</button></section></div>;
}

function PortalImports({ notify }: { notify: (message: string) => void }) {
  const [source, setSource] = useState<PortalSource>("Bayut");
  return <div className="portal-import-layout"><section className="portal-source-card"><h3>Property portal imports</h3><p>Source data is normalized, tagged and checked for duplicates.</p><div className="portal-source-grid">{portalSources.map((item) => <button key={item} className={source === item ? "active" : ""} onClick={() => setSource(item)}>{item}</button>)}</div><label><Upload />Upload source file<input type="file" onChange={() => notify(`${source} file selected and normalized`)} /></label></section><section className="import-pipeline-card"><h3>Import pipeline</h3>{["Detect source", "Normalize schema", "Tag source", "Detect duplicates", "Show errors", "Commit valid records"].map((step, index) => <div key={step}><i>{index + 1}</i><span>{step}</span><Check /></div>)}<button className="primary-button" onClick={() => notify(`${source} import preview generated`) }>Preview import</button></section></div>;
}

function PdfExtraction({ notify }: { notify: (message: string) => void }) {
  const [extracted, setExtracted] = useState(brochureExtractionSample());
  const confidence = extractionConfidence();
  return <div className="pdf-extraction-layout"><section className="pdf-upload-card"><FileArchive /><h3>PDF / brochure extraction</h3><p>Upload a property brochure and review extracted structured property data before saving it as a property or using it in a report.</p><label><Upload />Upload PDF brochure<input type="file" accept=".pdf" onChange={() => { setExtracted(brochureExtractionSample()); notify("PDF uploaded and extraction completed"); }} /></label><div className="extraction-stats"><span><strong>13</strong>Fields extracted</span><span><strong>4</strong>Low-confidence flags</span><span><strong>1</strong>Report-ready draft</span></div><div className="permission-note"><Check />Can link extracted property to buyer and reports</div></section><section className="extraction-review-card"><header><h3>Review extracted property data</h3><div><button onClick={() => notify("Extracted property saved to property inventory")}><Save />Save property</button><button onClick={() => notify("Extracted property added to report workflow")}>Use in report</button></div></header><div className="extraction-grid">{Object.entries(extracted).map(([key, value]) => { const score = confidence[key as keyof typeof confidence] ?? 80; return <label key={key} className={score < 70 ? "low-confidence" : ""}>{labelize(key)}<span>{score}% confidence{score < 70 ? " · review suggested" : ""}</span><textarea value={value} onChange={(event) => setExtracted({ ...extracted, [key]: event.target.value })} /></label>; })}</div></section></div>;
}

function ImportErrorReview({ notify }: { notify: (message: string) => void }) {
  const [rows, setRows] = useState(importErrorRecords.map((item) => ({ ...item, status: item.status as ImportErrorStatus })));
  const [filter, setFilter] = useState<"All" | ImportErrorStatus>("All");
  const visible = rows.filter((row) => filter === "All" || row.status === filter);
  function update(id: string, status: ImportErrorStatus, message: string) {
    setRows((all) => all.map((item) => item.id === id ? { ...item, status } : item));
    notify(message);
  }
  return <section className="import-error-review-card"><div className="import-error-toolbar"><div><h3>Import error review</h3><p>Failed records remain visible with reasons, status, retry and ignore actions.</p></div><label>Status<select value={filter} onChange={(event) => setFilter(event.target.value as "All" | ImportErrorStatus)}><option>All</option><option>Needs review</option><option>Retry queued</option><option>Ignored</option></select></label><button onClick={() => notify("Failed records CSV downloaded")}><Download />Download failed records</button></div><div className="import-error-head"><span>Import</span><span>Row</span><span>Source</span><span>External ID</span><span>Error reason</span><span>Status</span><span /></div>{visible.map((row) => <div className="import-error-row" key={row.id}><span><strong>{row.importId}</strong><small>{row.createdAt}</small></span><span>{row.row}</span><span>{row.source}</span><span>{row.externalId}</span><em>{row.reason}</em><strong>{row.status}</strong><footer><button onClick={() => update(row.id, "Retry queued", "Import retry queued")}><RefreshCcw />Retry</button><button onClick={() => update(row.id, "Ignored", "Failed record ignored")}><Trash2 />Ignore</button></footer></div>)}</section>;
}

function iconForTab(tab: Tab) { return tab === "CSV export" ? <Download /> : tab === "CRM webhook" ? <Webhook /> : tab === "WhatsApp Business" ? <MessageCircle /> : tab === "Portal imports" ? <Upload /> : tab === "Import errors" ? <AlertTriangle /> : <FileText />; }
function labelize(value: string) { return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase()); }
