"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Clock, Copy, EyeOff, Filter, Image as ImageIcon, Layers3, Search, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { dataQualityFactors, dataQualityScore, duplicateCandidates, listingFreshness, reportQualityWarnings, type DuplicateCandidate } from "@/lib/analytics-quality";
import { initialProperties } from "@/lib/property-data";
import { UiModal } from "@/components/ui-modal";

type Tab = "Quality scores" | "Duplicate review" | "Freshness";
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const money = (value: number) => `AED ${number.format(value)}`;

export function DataQualityCenter({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState<Tab>("Quality scores");
  const [freshnessFilter, setFreshnessFilter] = useState("All");
  const [review, setReview] = useState<DuplicateCandidate | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const duplicates = duplicateCandidates().filter((item) => !hidden.includes(item.id));
  const properties = useMemo(() => initialProperties.filter((property) => freshnessFilter === "All" || listingFreshness(property).label === freshnessFilter), [freshnessFilter]);
  const lowQuality = initialProperties.filter((property) => dataQualityScore(property) < 75).length;
  const stale = initialProperties.filter((property) => listingFreshness(property).label === "Stale").length;

  return <div className="module-stack data-quality-epic">
    <section className="quality-hero"><div><span><ShieldCheck />DATA QUALITY & DEDUPLICATION</span><h2>Internal listing reliability before reports go out</h2><p>Score listing completeness, flag duplicates across portals, and track freshness without deleting anything automatically.</p></div><button className="primary-button" onClick={() => notify("Quality audit exported")}><Copy />Export audit</button></section>
    <div className="quality-kpis"><Metric label="Properties checked" value={String(initialProperties.length)} detail="Current demo inventory" /><Metric label="Low-quality flags" value={String(lowQuality)} detail="Broker can still proceed" /><Metric label="Duplicate candidates" value={String(duplicates.length)} detail="Review only" /><Metric label="Stale listings" value={String(stale)} detail="Can exclude from reports" /></div>
    <div className="quality-tabs">{(["Quality scores", "Duplicate review", "Freshness"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "Quality scores" ? <ShieldCheck /> : item === "Duplicate review" ? <Layers3 /> : <Clock />}{item}</button>)}</div>
    {tab === "Quality scores" && <QualityScores notify={notify} />}
    {tab === "Duplicate review" && <DuplicateReview duplicates={duplicates} onOpen={setReview} onHide={(id) => { setHidden((all) => [...all, id]); notify("Duplicate candidate ignored for now"); }} />}
    {tab === "Freshness" && <FreshnessView properties={properties} filter={freshnessFilter} setFilter={setFreshnessFilter} notify={notify} />}
    {review && <DuplicateModal candidate={review} onClose={() => setReview(null)} notify={notify} />}
  </div>;
}

function QualityScores({ notify }: { notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const visible = initialProperties.filter((property) => `${property.title} ${property.neighbourhood}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="quality-score-card"><div className="quality-toolbar"><div><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search listings…" /></div><button onClick={() => notify("Report generator will warn on missing key fields")}><AlertTriangle />Report warnings enabled</button></div><div className="quality-head"><span>Property</span><span>Quality</span><span>Internal flags</span><span>Report warning</span><span /></div>{visible.map((property) => { const score = dataQualityScore(property); const warnings = reportQualityWarnings(property); return <div className="quality-row" key={property.id}><span><i style={property.images[0] ? { backgroundImage: `url(${property.images[0]})` } : undefined}>{!property.images[0] && <ImageIcon />}</i><b>{property.title}<small>{property.neighbourhood} · {property.source}</small></b></span><strong className={score < 75 ? "low" : ""}>{score}%</strong><span>{dataQualityFactors(property).filter((factor) => !factor.passed).slice(0, 3).map((factor) => <em key={factor.label}>{factor.label}</em>)}</span><span>{warnings.length ? `${warnings.length} warning(s)` : "Ready"}</span><button onClick={() => notify(score < 75 ? "Broker can proceed after acknowledging warnings" : "Listing has enough report-ready data")}><Sparkles />Use in report</button></div>; })}</section>;
}

function DuplicateReview({ duplicates, onOpen, onHide }: { duplicates: DuplicateCandidate[]; onOpen: (candidate: DuplicateCandidate) => void; onHide: (id: string) => void }) {
  return <section className="duplicate-grid">{duplicates.map((candidate) => <article key={candidate.id}><header><span>Duplicate confidence</span><strong>{candidate.confidence}%</strong><em>{candidate.status}</em></header><div className="duplicate-pair"><PropertyMini property={candidate.primary} /><PropertyMini property={candidate.duplicate} /></div><div className="duplicate-factors">{candidate.factors.map((factor) => <span key={factor}><Check />{factor}</span>)}</div><footer><button onClick={() => onOpen(candidate)}><Search />Review</button><button onClick={() => onHide(candidate.id)}><EyeOff />Ignore</button></footer></article>)}</section>;
}

function FreshnessView({ properties, filter, setFilter, notify }: { properties: typeof initialProperties; filter: string; setFilter: (value: string) => void; notify: (message: string) => void }) {
  return <section className="freshness-card"><div className="freshness-toolbar"><label><Filter />Freshness<select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>New</option><option>Fresh</option><option>Active</option><option>Stale</option><option>Unknown</option></select></label><button onClick={() => notify("Stale listings excluded from report defaults")}>Exclude stale from reports</button></div><div className="freshness-grid">{properties.map((property) => { const fresh = listingFreshness(property); return <article key={property.id} className={fresh.label.toLowerCase()}><header><strong>{fresh.score}%</strong><span>{fresh.label}</span></header><h3>{property.title}</h3><p>{property.neighbourhood} · {money(property.price)}</p><ul>{fresh.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></article>; })}</div></section>;
}

function DuplicateModal({ candidate, onClose, notify }: { candidate: DuplicateCandidate; onClose: () => void; notify: (message: string) => void }) {
  return <UiModal title="Review duplicate candidate" subtitle={`${candidate.confidence}% confidence · not deleted automatically`} onClose={onClose} size="large"><div className="duplicate-modal-body"><div className="duplicate-pair large"><PropertyMini property={candidate.primary} /><PropertyMini property={candidate.duplicate} /></div><section><h3>Matched factors</h3>{candidate.factors.map((factor) => <p key={factor}><Check />{factor}</p>)}<div className="form-notice"><AlertTriangle /><span>Reports should avoid showing both as separate options unless broker confirms they are different units.</span></div></section></div><div className="form-actions"><button className="ghost-button" onClick={onClose}>Close</button><button className="ghost-button" onClick={() => { notify("Duplicate kept separate for now"); onClose(); }}><EyeOff />Keep separate</button><button className="primary-button" onClick={() => { notify("Duplicate marked for merge later"); onClose(); }}><Trash2 />Mark for merge later</button></div></UiModal>;
}

function PropertyMini({ property }: { property: typeof initialProperties[number] }) { return <div className="duplicate-property-mini"><div style={property.images[0] ? { backgroundImage: `url(${property.images[0]})` } : undefined} /><strong>{property.title}</strong><span>{property.source} · {property.externalId}</span><p>{property.building} · {property.rooms || "Studio"} bed · {property.areaSqFt.toLocaleString()} sq ft · {money(property.price)}</p></div>; }
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <article><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
