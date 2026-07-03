"use client";

import { useMemo, useState } from "react";
import { Bell, Bookmark, Check, Copy, EyeOff, Filter, Link2, MessageCircle, Pencil, Play, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { initialBuyerProfiles } from "@/lib/buyer-data";
import { listingFreshness } from "@/lib/analytics-quality";
import { scoreBuyerProperty } from "@/lib/matching-engine";
import { initialProperties, type PropertyRecord } from "@/lib/property-data";
import { UiModal, ConfirmModal, FormActions } from "@/components/ui-modal";

type SearchFilters = {
  purpose: "buy" | "rent" | "all";
  area: string;
  propertyType: string;
  minBudget: string;
  maxBudget: string;
  beds: string;
  baths: string;
  minSize: string;
  maxSize: string;
  completion: string;
  furnishing: string;
  verifiedOnly: boolean;
  source: string;
  minDealScore: string;
  minMatchScore: string;
  freshness: string;
};
type DismissedMatch = { propertyId: string; signature: string };
type SavedBuyerSearch = {
  id: string;
  name: string;
  buyerId: string;
  filters: SearchFilters;
  alerts: { inApp: boolean; email: boolean; whatsapp: boolean };
  active: boolean;
  createdFromBuyer: boolean;
  lastRun: string;
  dismissedMatches: DismissedMatch[];
  shortlistedPropertyIds: string[];
};
type FeedMatch = { search: SavedBuyerSearch; property: PropertyRecord; reason: string; isNew: boolean; matchScore: number; dealScore: number; freshness: string };

const savedSearchLimit = 8;
const defaultFilters: SearchFilters = { purpose: "buy", area: "Dubai Marina", propertyType: "Apartment", minBudget: "", maxBudget: "", beds: "all", baths: "all", minSize: "", maxSize: "", completion: "all", furnishing: "all", verifiedOnly: false, source: "all", minDealScore: "", minMatchScore: "", freshness: "all" };
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const money = (value: number) => `AED ${number.format(value)}`;

const initialSearches: SavedBuyerSearch[] = [
  { id: "ss_omar", name: "Omar · Marina yield watch", buyerId: "buy_omar", filters: { ...defaultFilters, area: "Dubai Marina", minBudget: "2000000", maxBudget: "3200000", beds: "2", baths: "2", minDealScore: "70", minMatchScore: "70", verifiedOnly: true }, alerts: { inApp: true, email: true, whatsapp: false }, active: true, createdFromBuyer: true, lastRun: "Today · 09:12", dismissedMatches: [], shortlistedPropertyIds: [] },
  { id: "ss_sarah", name: "Sarah · family-ready communities", buyerId: "buy_sarah", filters: { ...defaultFilters, area: "Dubai Hills", minBudget: "3500000", maxBudget: "5000000", beds: "2", completion: "Ready", freshness: "Fresh" }, alerts: { inApp: true, email: false, whatsapp: false }, active: true, createdFromBuyer: true, lastRun: "Yesterday", dismissedMatches: [], shortlistedPropertyIds: [] },
  { id: "ss_lina", name: "Lina · off-plan entry", buyerId: "buy_lina", filters: { ...defaultFilters, area: "Dubai Creek Harbour", minBudget: "1200000", maxBudget: "2200000", completion: "Off-plan", source: "bayut" }, alerts: { inApp: false, email: false, whatsapp: false }, active: false, createdFromBuyer: false, lastRun: "22 Jun", dismissedMatches: [], shortlistedPropertyIds: [] },
];

export function SavedSearchAlerts({ notify, onReport }: { notify: (message: string) => void; onReport: () => void }) {
  const [tab, setTab] = useState<"Builder" | "New match feed" | "Alerts">("Builder");
  const [searches, setSearches] = useState(initialSearches);
  const [editing, setEditing] = useState<SavedBuyerSearch | "new" | null>(null);
  const [deleting, setDeleting] = useState<SavedBuyerSearch | null>(null);
  const [pitch, setPitch] = useState<FeedMatch | null>(null);
  const feed = useMemo(() => buildFeed(searches), [searches]);
  const activeAlerts = searches.filter((item) => item.active && (item.alerts.inApp || item.alerts.email || item.alerts.whatsapp)).length;
  const limitReached = searches.length >= savedSearchLimit;

  function save(next: SavedBuyerSearch) {
    const isNew = !searches.some((item) => item.id === next.id);
    if (isNew && searches.length >= savedSearchLimit) {
      notify("Saved search plan limit reached — upgrade prompt shown");
      return;
    }
    setSearches((all) => all.some((item) => item.id === next.id) ? all.map((item) => item.id === next.id ? next : item) : [next, ...all]);
    setEditing(null);
    notify("Saved search stored with buyer-linked filters");
  }

  function runSearch(search: SavedBuyerSearch) {
    setSearches((all) => all.map((item) => item.id === search.id ? { ...item, lastRun: "Just now" } : item));
    notify(`${matchProperties(search).length} matching properties found`);
  }

  function dismiss(match: FeedMatch) {
    setSearches((all) => all.map((item) => item.id === match.search.id ? { ...item, dismissedMatches: [...item.dismissedMatches, { propertyId: match.property.id, signature: propertySignature(match.property) }] } : item));
    notify("Match dismissed. It will reappear only after a significant property update.");
  }

  function shortlist(match: FeedMatch) {
    setSearches((all) => all.map((item) => item.id === match.search.id ? { ...item, shortlistedPropertyIds: Array.from(new Set([...item.shortlistedPropertyIds, match.property.id])) } : item));
    notify("Property shortlisted directly from the buyer match feed");
  }

  return <div className="module-stack saved-alerts-epic">
    <section className="saved-alerts-hero"><div><span><Bookmark />SAVED SEARCHES & MATCH FEED</span><h2>Buyer-linked searches with plan-aware match monitoring</h2><p>Create reusable filters, attach them to buyers, re-run anytime, and see fresh matching inventory grouped by buyer.</p></div><button className="primary-button" disabled={limitReached} onClick={() => setEditing("new")}><Plus />New saved search</button></section>
    <div className="saved-alert-kpis"><Metric label="Saved searches" value={`${searches.length}/${savedSearchLimit}`} detail={limitReached ? "Plan limit reached" : `${savedSearchLimit - searches.length} remaining`} /><Metric label="New matches" value={String(feed.length)} detail="Grouped by buyer" /><Metric label="Alerts enabled" value={String(activeAlerts)} detail="In-app / email now" /><Metric label="Buyer-linked" value={String(searches.filter((item) => item.createdFromBuyer).length)} detail="Appears on profile" /></div>
    <div className="saved-alert-tabs">{(["Builder", "New match feed", "Alerts"] as const).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "Builder" ? <Filter /> : item === "New match feed" ? <Sparkles /> : <Bell />}{item}{item === "New match feed" && <span>{feed.length}</span>}</button>)}</div>

    {tab === "Builder" && <SearchBuilderList searches={searches} onRun={runSearch} onEdit={setEditing} onDelete={setDeleting} notify={notify} />}
    {tab === "New match feed" && <NewMatchFeed matches={feed} onPitch={setPitch} onShortlist={shortlist} onDismiss={dismiss} onReport={onReport} />}
    {tab === "Alerts" && <AlertsView searches={searches} setSearches={setSearches} notify={notify} />}
    {editing && <SavedSearchEditor search={editing === "new" ? undefined : editing} limitReached={limitReached && editing === "new"} onClose={() => setEditing(null)} onSave={save} />}
    {deleting && <ConfirmModal title="Delete saved search?" message={`Delete “${deleting.name}”? Alerts and feed grouping for this search will stop.`} onCancel={() => setDeleting(null)} onConfirm={() => { setSearches((all) => all.filter((item) => item.id !== deleting.id)); setDeleting(null); notify("Saved search deleted"); }} />}
    {pitch && <PitchModal match={pitch} onClose={() => setPitch(null)} notify={notify} />}
  </div>;
}

function SearchBuilderList({ searches, onRun, onEdit, onDelete, notify }: { searches: SavedBuyerSearch[]; onRun: (search: SavedBuyerSearch) => void; onEdit: (search: SavedBuyerSearch) => void; onDelete: (search: SavedBuyerSearch) => void; notify: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const visible = searches.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || buyerName(item.buyerId).toLowerCase().includes(query.toLowerCase()));
  return <section className="saved-builder-layout"><div className="saved-search-toolbar"><div><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved searches or buyers…" /></div><button onClick={() => notify("Buyer profile criteria pre-fill is ready in the saved search modal")}>Create from buyer</button></div><div className="saved-builder-grid">{visible.map((search) => { const matches = matchProperties(search); return <article key={search.id}><header><i><Bookmark /></i><span><strong>{search.name}</strong><small>{buyerName(search.buyerId)} · {search.lastRun}</small></span><em className={search.active ? "active" : ""}>{search.active ? "Active" : "Paused"}</em></header><div className="filter-chip-row">{filterSummary(search.filters).map((item) => <span key={item}>{item}</span>)}</div><div className="search-result-mini"><strong>{matches.length}</strong><span>matching properties</span><small>{search.shortlistedPropertyIds.length} shortlisted · {search.createdFromBuyer ? "Linked to buyer profile" : "Manual saved search"}</small></div><footer><button onClick={() => onRun(search)}><Play />Run</button><button onClick={() => onEdit(search)}><Pencil />Edit</button><button onClick={() => onDelete(search)}><Trash2 />Delete</button></footer></article>; })}</div></section>;
}

function NewMatchFeed({ matches, onPitch, onShortlist, onDismiss, onReport }: { matches: FeedMatch[]; onPitch: (match: FeedMatch) => void; onShortlist: (match: FeedMatch) => void; onDismiss: (match: FeedMatch) => void; onReport: () => void }) {
  const grouped = groupByBuyer(matches);
  if (!matches.length) return <section className="empty-state-card"><Sparkles /><h3>No new matches right now</h3><p>Dismissed matches stay hidden until price or listing update changes significantly.</p></section>;
  return <div className="match-feed-stack">{Object.entries(grouped).map(([buyerId, items]) => <section key={buyerId} className="buyer-feed-group"><header><div><strong>{buyerName(buyerId)}</strong><span>{items.length} new matching propert{items.length === 1 ? "y" : "ies"}</span></div><em>{initialBuyerProfiles.find((item) => item.id === buyerId)?.persona}</em></header>{items.map((match) => <article key={`${match.search.id}-${match.property.id}`}><div className="feed-property-image" style={match.property.images[0] ? { backgroundImage: `url(${match.property.images[0]})` } : undefined}><span>{match.isNew ? "NEW" : "MATCH"}</span></div><div><h3>{match.property.title}</h3><p>{match.reason}</p><span>{match.property.neighbourhood} · {match.property.rooms || "Studio"} bed · {money(match.property.price)} · Match {match.matchScore}% · Deal {match.dealScore} · {match.freshness}</span></div><footer><button onClick={() => onPitch(match)}><MessageCircle />Pitch</button><button onClick={() => onShortlist(match)}><Check />Shortlist</button><button onClick={onReport}><Sparkles />Report</button><button onClick={() => onDismiss(match)}><EyeOff />Dismiss</button></footer></article>)}</section>)}</div>;
}

function AlertsView({ searches, setSearches, notify }: { searches: SavedBuyerSearch[]; setSearches: React.Dispatch<React.SetStateAction<SavedBuyerSearch[]>>; notify: (message: string) => void }) {
  function toggle(id: string, channel: keyof SavedBuyerSearch["alerts"]) {
    setSearches((all) => all.map((item) => item.id === id ? { ...item, alerts: { ...item.alerts, [channel]: !item.alerts[channel] } } : item));
    notify("Alert preference updated");
  }
  return <section className="alerts-table-card"><div className="alerts-head"><span>Search</span><span>Buyer/property link</span><span>In-app</span><span>Email</span><span>WhatsApp later</span><span>Status</span></div>{searches.map((search) => <div className="alerts-row" key={search.id}><span><strong>{search.name}</strong><small>{filterSummary(search.filters).slice(0, 3).join(" · ")}</small></span><span><Link2 />{buyerName(search.buyerId)}</span><button className={search.alerts.inApp ? "on" : ""} onClick={() => toggle(search.id, "inApp")}><i /></button><button className={search.alerts.email ? "on" : ""} onClick={() => toggle(search.id, "email")}><i /></button><button className={search.alerts.whatsapp ? "on" : ""} onClick={() => toggle(search.id, "whatsapp")}><i /></button><em>{search.active ? "Monitoring" : "Paused"}</em></div>)}</section>;
}

function SavedSearchEditor({ search, limitReached, onClose, onSave }: { search?: SavedBuyerSearch; limitReached: boolean; onClose: () => void; onSave: (search: SavedBuyerSearch) => void }) {
  const fromBuyer = initialBuyerProfiles[0];
  const [draft, setDraft] = useState<SavedBuyerSearch>(search ?? { id: `ss_${Date.now()}`, name: `${fromBuyer.name.split(" ")[0]} · new search`, buyerId: fromBuyer.id, filters: { ...defaultFilters, area: fromBuyer.preferredAreas[0], minBudget: String(fromBuyer.budgetMin), maxBudget: String(fromBuyer.budgetMax), beds: String(fromBuyer.bedrooms) }, alerts: { inApp: true, email: false, whatsapp: false }, active: true, createdFromBuyer: true, lastRun: "Not run yet", dismissedMatches: [], shortlistedPropertyIds: [] });
  const filters = draft.filters;
  function patch<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) { setDraft({ ...draft, filters: { ...draft.filters, [key]: value } }); }
  return <UiModal title={search ? "Edit saved search" : "Create saved search"} subtitle="Store reusable inventory filters, pre-fill from buyer criteria, and link results back to the buyer." onClose={onClose} size="large"><form className="crud-form" onSubmit={(event) => { event.preventDefault(); onSave(draft); }}><div className="crud-grid"><label className="span-2">Search name<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><label>Linked buyer<select value={draft.buyerId} onChange={(event) => { const buyer = initialBuyerProfiles.find((item) => item.id === event.target.value); setDraft({ ...draft, buyerId: event.target.value, createdFromBuyer: true, filters: buyer ? { ...draft.filters, purpose: buyer.purpose, area: buyer.preferredAreas[0], propertyType: buyer.propertyTypes[0] ?? "Apartment", minBudget: String(buyer.budgetMin), maxBudget: String(buyer.budgetMax), beds: String(buyer.bedrooms) } : draft.filters }); }}>{initialBuyerProfiles.map((buyer) => <option key={buyer.id} value={buyer.id}>{buyer.name}</option>)}</select></label><label>Purpose<select value={filters.purpose} onChange={(event) => patch("purpose", event.target.value as SearchFilters["purpose"])}><option value="all">Any</option><option value="buy">Buy</option><option value="rent">Rent</option></select></label><label>Area<input value={filters.area} onChange={(event) => patch("area", event.target.value)} /></label><label>Property type<select value={filters.propertyType} onChange={(event) => patch("propertyType", event.target.value)}><option value="all">Any</option><option>Apartment</option><option>Villa</option><option>Townhouse</option></select></label><label>Min budget<input type="number" value={filters.minBudget} onChange={(event) => patch("minBudget", event.target.value)} /></label><label>Max budget<input type="number" value={filters.maxBudget} onChange={(event) => patch("maxBudget", event.target.value)} /></label><label>Beds<select value={filters.beds} onChange={(event) => patch("beds", event.target.value)}><option value="all">Any</option><option value="0">Studio</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option></select></label><label>Bathrooms<select value={filters.baths} onChange={(event) => patch("baths", event.target.value)}><option value="all">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label><label>Min size<input type="number" value={filters.minSize} onChange={(event) => patch("minSize", event.target.value)} placeholder="sq ft" /></label><label>Max size<input type="number" value={filters.maxSize} onChange={(event) => patch("maxSize", event.target.value)} placeholder="sq ft" /></label><label>Completion<select value={filters.completion} onChange={(event) => patch("completion", event.target.value)}><option value="all">Any</option><option>Ready</option><option>Off-plan</option></select></label><label>Furnishing<select value={filters.furnishing} onChange={(event) => patch("furnishing", event.target.value)}><option value="all">Any</option><option>Furnished</option><option>Unfurnished</option><option>Not specified</option></select></label><label>Source<select value={filters.source} onChange={(event) => patch("source", event.target.value)}><option value="all">Any</option><option value="bayut">Bayut</option><option value="dubizzle">Dubizzle</option><option value="manual">Manual</option></select></label><label>Min deal score<input type="number" min="0" max="100" value={filters.minDealScore} onChange={(event) => patch("minDealScore", event.target.value)} /></label><label>Min match score<input type="number" min="0" max="100" value={filters.minMatchScore} onChange={(event) => patch("minMatchScore", event.target.value)} /></label><label>Freshness<select value={filters.freshness} onChange={(event) => patch("freshness", event.target.value)}><option value="all">Any</option><option>New</option><option>Fresh</option><option>Active</option><option>Stale</option><option>Unknown</option></select></label><label className="checkbox-card"><input type="checkbox" checked={filters.verifiedOnly} onChange={(event) => patch("verifiedOnly", event.target.checked)} />Verified only</label></div><div className="alert-channel-row"><label><input type="checkbox" checked={draft.alerts.inApp} onChange={(event) => setDraft({ ...draft, alerts: { ...draft.alerts, inApp: event.target.checked } })} />In-app alert</label><label><input type="checkbox" checked={draft.alerts.email} onChange={(event) => setDraft({ ...draft, alerts: { ...draft.alerts, email: event.target.checked } })} />Email alert</label><label><input type="checkbox" checked={draft.alerts.whatsapp} onChange={(event) => setDraft({ ...draft, alerts: { ...draft.alerts, whatsapp: event.target.checked } })} />WhatsApp later</label></div>{limitReached && <div className="form-notice"><Bell /><span>Plan limit reached. Existing searches can still be edited; new searches require an upgrade.</span></div>}<FormActions onCancel={onClose} submitLabel={search ? "Save search" : "Create saved search"} /></form></UiModal>;
}

function PitchModal({ match, onClose, notify }: { match: FeedMatch; onClose: () => void; notify: (message: string) => void }) {
  const buyer = initialBuyerProfiles.find((item) => item.id === match.search.buyerId)!;
  const text = `Hi ${buyer.name.split(" ")[0]}, I found a fresh option matching your saved search: ${match.property.title} in ${match.property.neighbourhood}. It fits because ${match.reason.toLowerCase()} Asking price is ${money(match.property.price)}. Want me to send a short report with the trade-offs?`;
  return <UiModal title="Generated pitch" subtitle={`${match.property.title} → ${buyer.name}`} onClose={onClose}><div className="pitch-modal"><div><Sparkles /><span><strong>New match pitch</strong>Built from saved search filters, buyer profile, match score and deal score.</span></div><textarea readOnly value={text} /><div className="form-actions"><button className="ghost-button" onClick={onClose}>Close</button><button className="primary-button" onClick={() => { navigator.clipboard?.writeText(text); notify("Pitch copied and buyer activity logged locally"); }}><Copy />Copy pitch</button></div></div></UiModal>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <article><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
function buyerName(id: string) { return initialBuyerProfiles.find((buyer) => buyer.id === id)?.name ?? "Unlinked buyer"; }
function buyerForSearch(search: SavedBuyerSearch) { return initialBuyerProfiles.find((buyer) => buyer.id === search.buyerId) ?? initialBuyerProfiles[0]; }
function filterSummary(filters: SearchFilters) {
  return [
    filters.purpose === "all" ? "Any purpose" : filters.purpose === "buy" ? "Buy" : "Rent",
    filters.area || "Any area",
    filters.propertyType === "all" ? "Any type" : filters.propertyType,
    filters.beds === "all" ? "Any beds" : filters.beds === "0" ? "Studio" : `${filters.beds} bed`,
    filters.baths === "all" ? "Any baths" : `${filters.baths}+ bath`,
    filters.minSize ? `Min ${filters.minSize} sq ft` : "",
    filters.minDealScore ? `Deal ${filters.minDealScore}+` : "",
    filters.minMatchScore ? `Match ${filters.minMatchScore}+` : "",
    filters.freshness === "all" ? "" : filters.freshness,
    filters.verifiedOnly ? "Verified only" : "All quality",
  ].filter(Boolean);
}
function matchProperties(search: SavedBuyerSearch) {
  const buyer = buyerForSearch(search);
  return initialProperties.filter((property) => {
    const f = search.filters;
    const match = scoreBuyerProperty(buyer, property);
    const freshness = listingFreshness(property);
    const dismissed = search.dismissedMatches.some((item) => item.propertyId === property.id && item.signature === propertySignature(property));
    return !dismissed && (f.purpose === "all" || property.purpose === f.purpose) && (!f.area || property.neighbourhood.toLowerCase().includes(f.area.toLowerCase()) || f.area.toLowerCase().includes(property.neighbourhood.toLowerCase())) && (f.propertyType === "all" || property.propertyType === f.propertyType) && (!f.minBudget || property.price >= Number(f.minBudget)) && (!f.maxBudget || property.price <= Number(f.maxBudget)) && (f.beds === "all" || (f.beds === "4" ? property.rooms >= 4 : property.rooms === Number(f.beds))) && (f.baths === "all" || (property.baths ?? 0) >= Number(f.baths)) && (!f.minSize || property.areaSqFt >= Number(f.minSize)) && (!f.maxSize || property.areaSqFt <= Number(f.maxSize)) && (f.completion === "all" || property.completionStatus === f.completion) && (f.furnishing === "all" || property.furnishing === f.furnishing) && (!f.verifiedOnly || property.verified) && (f.source === "all" || property.source === f.source) && (!f.minDealScore || match.dealScore >= Number(f.minDealScore)) && (!f.minMatchScore || match.score >= Number(f.minMatchScore)) && (f.freshness === "all" || freshness.label === f.freshness);
  });
}
function buildFeed(searches: SavedBuyerSearch[]): FeedMatch[] {
  return searches.filter((search) => search.active).flatMap((search) => matchProperties(search).map((property) => {
    const buyer = buyerForSearch(search);
    const match = scoreBuyerProperty(buyer, property);
    const freshness = listingFreshness(property);
    return { search, property, isNew: freshness.label === "New" || new Date(property.updatedAt).getTime() >= new Date("2026-06-20").getTime(), reason: reasonForMatch(search, property), matchScore: match.score, dealScore: match.dealScore, freshness: freshness.label };
  })).filter((match) => match.isNew);
}
function reasonForMatch(search: SavedBuyerSearch, property: PropertyRecord) {
  const buyer = buyerForSearch(search);
  const match = scoreBuyerProperty(buyer, property);
  const reasons = [`${property.neighbourhood} matches the saved area`];
  if (property.price >= buyer.budgetMin && property.price <= buyer.budgetMax) reasons.push("inside buyer budget");
  if (search.filters.beds !== "all" && property.rooms === Number(search.filters.beds)) reasons.push(`${search.filters.beds}-bed fit`);
  if (match.score >= 70) reasons.push(`${match.score}% buyer fit`);
  if (match.dealScore >= 70) reasons.push(`${match.dealScore}/100 deal score`);
  if (property.estimatedYield) reasons.push(`${property.estimatedYield}% estimated yield`);
  return reasons.join(", ");
}
function propertySignature(property: PropertyRecord) { return `${property.updatedAt}-${property.price}-${property.areaSqFt}`; }
function groupByBuyer(matches: FeedMatch[]) {
  return matches.reduce<Record<string, FeedMatch[]>>((groups, match) => ({ ...groups, [match.search.buyerId]: [...(groups[match.search.buyerId] ?? []), match] }), {});
}
