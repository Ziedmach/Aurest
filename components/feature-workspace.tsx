"use client";

import { useState } from "react";
import {
  Activity, AlertCircle, ArrowRight, Bell, Bookmark, Building2, Check,
  ChevronDown, CircleDollarSign, Download, Eye, FileBarChart,
  FileText, Filter, Gauge, Languages, Link2, ListFilter,
  Lock, MapPin, MessageCircle, Palette, Pencil, Plus, Search,
  Settings, ShieldCheck, Sparkles, Target, Trash2, TrendingUp, Upload, UserPlus,
  Users, WandSparkles,
} from "lucide-react";
import type { Buyer, Match } from "@/lib/matching";
import { activityEvents, demoBuyers, demoReports, marketAreas, savedSearches, teamMembers, type DemoBuyer, type DemoReport } from "@/lib/demo-data";
import { apiEndpoints } from "@/lib/api-contract";
import { canAccessPage, pageAccessMap, roleScopeSummary } from "@/lib/rbac";
import { ConfirmModal, FormActions, UiModal } from "@/components/ui-modal";
import { WorkspaceEpic } from "@/components/workspace-epic";
import type { BrokerProfile, Workspace } from "@/lib/workspace";
import type { AuthSession } from "@/lib/auth";
import { SecurityEpic } from "@/components/security-epic";
import { PropertyEpic } from "@/components/property-epic";
import { BuyerEpic } from "@/components/buyer-epic";
import { MatchingEpic } from "@/components/matching-epic";
import { SalesCopilot } from "@/components/sales-copilot";
import { MarketIntelligence } from "@/components/market-intelligence";
import { SavedSearchAlerts } from "@/components/saved-search-alerts";
import { TeamAgencyManagement } from "@/components/team-agency-management";
import { AnalyticsPerformance } from "@/components/analytics-performance";
import { DataQualityCenter } from "@/components/data-quality";
import { IntegrationsExport } from "@/components/integrations-export";
import { BillingPackaging } from "@/components/billing-packaging";
import { ComplianceGuardrails } from "@/components/compliance-guardrails";
import { AIContentManagement } from "@/components/ai-content-management";
import { AurestModuleScreen } from "@/components/aurest-v2";
import { getAurestModule } from "@/lib/aurest-data";
import { BrokerWorkspaceHub } from "@/components/broker-workspace-hub";
import { AurestConnect } from "@/components/aurest-connect";

type Props = {
  active: string;
  buyer: Buyer;
  matches: Match[];
  onBuyer: () => void;
  onReport: () => void;
  notify: (message: string) => void;
  workspace: Workspace;
  profile: BrokerProfile;
  onWorkspaceChange: (workspace: Workspace) => void;
  onProfileChange: (profile: BrokerProfile) => void;
  session: AuthSession;
  onLogout: () => void;
};
type SavedSearch = (typeof savedSearches)[number];
type TeamMember = (typeof teamMembers)[number];

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const money = { format: (value: number) => `AED ${number.format(value)}` };

export function FeatureWorkspace(props: Props) {
  const access = canAccessPage(props.session.user.role, props.workspace.type, props.active);
  if (!access.allowed) return <AccessDeniedView active={props.active} reason={access.reason} workspace={props.workspace} role={props.session.user.role} notify={props.notify} />;
  const aurestModule = getAurestModule(props.active);

  switch (props.active) {
    case "Buyer CRM":
    case "Property Matching":
    case "Shortlists":
    case "WhatsApp Pitch":
    case "Deal Pipeline":
      return <BrokerWorkspaceHub active={props.active} workspace={props.workspace} profile={props.profile} notify={props.notify} onReport={props.onReport} />;
    case "Buyer Profile":
    case "Buyers": return <BuyerEpic onReport={props.onReport} notify={props.notify} />;
    case "Scraped Listings":
    case "Manual Listings":
    case "Developer Inventory":
    case "Properties": return <PropertyEpic onReport={props.onReport} notify={props.notify} />;
    case "Buyer Match":
    case "Recommendations": return <MatchingEpic onReport={props.onReport} notify={props.notify} />;
    case "Buyer Reports":
    case "Investment Reports":
    case "Agency Branded Reports":
    case "Reports": return <BrokerWorkspaceHub active={props.active} workspace={props.workspace} profile={props.profile} notify={props.notify} onReport={props.onReport} />;
    case "Sales copilot": return <SalesCopilot workspace={props.workspace} profile={props.profile} notify={props.notify} />;
    case "Saved searches": return <SavedSearchAlerts notify={props.notify} onReport={props.onReport} />;
    case "Community Intelligence":
    case "Building Intelligence":
    case "Market Benchmarks":
    case "Yield Estimator":
    case "Google Maps / POI Enrichment":
    case "Top Trending Places":
    case "Market Heatmaps":
    case "Market intel": return <MarketIntelligence notify={props.notify} />;
    case "Broker Network":
    case "Agency Network":
    case "Verification":
    case "Founding Brokers":
    case "Founding Broker Program":
    case "Private Requests":
    case "Deal Sharing":
    case "Deal Rooms":
    case "Referrals":
    case "Referral Requests":
    case "Advisory Council":
    case "Trust Score":
    case "Broker Ranking":
    case "Discussions":
    case "Events": return <AurestConnect active={props.active} notify={props.notify} />;
    case "Analytics": return <AnalyticsPerformance notify={props.notify} />;
    case "Duplicate Detection":
    case "Listing Quality Score":
    case "Price History":
    case "Data quality": return <DataQualityCenter notify={props.notify} />;
    case "Integrations": return <IntegrationsExport notify={props.notify} />;
    case "Billing": return <BillingPackaging workspace={props.workspace} notify={props.notify} />;
    case "Compliance": return <ComplianceGuardrails workspace={props.workspace} notify={props.notify} />;
    case "AI content": return <AIContentManagement workspace={props.workspace} onWorkspaceChange={props.onWorkspaceChange} notify={props.notify} />;
    case "Team Management":
    case "Lead Assignment":
    case "Broker Performance":
    case "Users & Roles":
    case "Team analytics": return <TeamAgencyManagement workspace={props.workspace} notify={props.notify} />;
    case "Activity": return <ActivityView />;
    case "Workspace": return <WorkspaceEpic workspace={props.workspace} profile={props.profile} onWorkspaceChange={props.onWorkspaceChange} onProfileChange={props.onProfileChange} notify={props.notify} />;
    case "Permissions":
    case "Audit Logs":
    case "Security": return <SecurityEpic workspace={props.workspace} session={props.session} onLogout={props.onLogout} notify={props.notify} />;
    case "Admin": return <TeamAgencyManagement workspace={props.workspace} notify={props.notify} />;
    case "Settings": return <SettingsView {...props} />;
    default: return aurestModule ? <AurestModuleScreen module={aurestModule} notify={props.notify} /> : <EmptyView {...props} />;
  }
}

function AccessDeniedView({ active, reason, workspace, role, notify }: { active: string; reason: string; workspace: Workspace; role: AuthSession["user"]["role"]; notify: (message: string) => void }) {
  const scope = roleScopeSummary(role);
  const policy = pageAccessMap.find((item) => item.page === active);
  return <section className="access-denied-card">
    <div className="access-denied-icon"><Lock /></div>
    <span>RBAC BLOCKED · 403</span>
    <h2>{active} is not available for {role}</h2>
    <p>{reason}</p>
    <div className="access-denied-grid">
      <div><small>Workspace</small><strong>{workspace.name}</strong><em>{workspace.type} workspace</em></div>
      <div><small>Active role</small><strong>{role}</strong><em>{scope.description}</em></div>
      <div><small>Required policy</small><strong>{policy?.permission ?? "No policy"}</strong><em>{policy?.description ?? "Page has no special rule."}</em></div>
    </div>
    <button className="primary-button" onClick={() => notify("Ask the workspace owner/admin to change this member role")}>Request access</button>
  </section>;
}

function Toolbar({ children, search, setSearch }: { children?: React.ReactNode; search: string; setSearch: (value: string) => void }) {
  return <div className="module-toolbar"><div className="module-search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" /></div>{children}</div>;
}

export function BuyersView({ notify }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState("buy_omar");
  const [items, setItems] = useState(demoBuyers);
  const [editing, setEditing] = useState<DemoBuyer | "new" | null>(null);
  const [deleting, setDeleting] = useState<DemoBuyer | null>(null);
  const buyers = items.filter((item) => (item.name + item.persona + item.areas).toLowerCase().includes(search.toLowerCase()) && (status === "All statuses" || item.status === status));
  const current = items.find((item) => item.id === selected) ?? items[0];
  function saveBuyer(next: DemoBuyer) {
    setItems((all) => all.some((item) => item.id === next.id) ? all.map((item) => item.id === next.id ? next : item) : [next, ...all]);
    setSelected(next.id); setEditing(null); notify("Buyer saved and match queue refreshed");
  }
  return <div className="module-stack">
    <div className="module-tabs"><button className="active">All buyers <span>12</span></button><button>My buyers <span>8</span></button><button>Unassigned <span>2</span></button></div>
    <Toolbar search={search} setSearch={setSearch}>
      <label className="select-control"><ListFilter size={15} /><select value={status} onChange={(e) => setStatus(e.target.value)}><option>All statuses</option><option>New lead</option><option>Qualified</option><option>Shortlist sent</option><option>Viewing scheduled</option><option>Negotiation</option></select></label>
      <button className="primary-button" onClick={() => setEditing("new")}><Plus size={16} />New buyer</button>
    </Toolbar>
    <div className="split-workspace">
      <section className="data-card buyer-table-card">
        <div className="table-head"><span>Buyer</span><span>Requirements</span><span>Status</span><span>Next action</span></div>
        {buyers.map((item) => <button className={selected === item.id ? "table-row selected" : "table-row"} key={item.id} onClick={() => setSelected(item.id)}>
          <span className="buyer-cell"><i>{item.initials}</i><b>{item.name}<small>{item.persona}</small></b></span>
          <span>{item.budget}<small>{item.areas}</small></span>
          <span><em className={`status-chip ${slug(item.status)}`}>{item.status}</em></span>
          <span>{item.nextAction}<small>Owner: {item.owner}</small></span>
        </button>)}
      </section>
      <aside className="detail-rail">
        <div className="detail-person"><div className="large-avatar">{current.initials}</div><div><h3>{current.name}</h3><p>{current.persona}</p></div><button onClick={() => setEditing(current)} aria-label="Edit buyer"><Pencil size={17} /></button></div>
        <div className="profile-score"><span>PROFILE QUALITY</span><strong>92%</strong><div><i /></div></div>
        <InfoRow label="Budget" value={current.budget} /><InfoRow label="Preferred areas" value={current.areas} /><InfoRow label="Status" value={current.status} /><InfoRow label="Assigned broker" value={current.owner} />
        <div className="ai-summary"><Sparkles size={17} /><div><strong>AI needs summary</strong><p>Yield-focused buyer prioritising ready 2-bedroom units, established rental demand, and long-term liquidity.</p></div></div>
        <button className="primary-button rail-action" onClick={() => notify(`Matching inventory for ${current.name}`)}>Find matching properties <ArrowRight size={16} /></button>
        <div className="rail-secondary-actions"><button onClick={() => setEditing(current)}><Pencil size={14} />Edit</button><button onClick={() => setDeleting(current)}><Trash2 size={14} />Delete</button></div>
      </aside>
    </div>
    {editing && <BuyerCrudModal buyer={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} onSave={saveBuyer} />}
    {deleting && <ConfirmModal title="Delete buyer profile?" message={`Remove ${deleting.name} and hide their saved searches from the workspace? Generated reports will remain archived.`} onCancel={() => setDeleting(null)} onConfirm={() => { setItems((all) => all.filter((item) => item.id !== deleting.id)); setDeleting(null); setSelected(items.find((item) => item.id !== deleting.id)?.id ?? ""); notify("Buyer deleted from fake workspace"); }} />}
  </div>;
}

export function PropertiesView({ matches, notify, onReport }: Props) {
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const [properties, setProperties] = useState(matches);
  const [editing, setEditing] = useState<Match | "new" | null>(null);
  const [detail, setDetail] = useState<Match | null>(null);
  const [deleting, setDeleting] = useState<Match | null>(null);
  const [importing, setImporting] = useState(false);
  const filtered = properties.filter((item) => (item.title + item.area).toLowerCase().includes(search.toLowerCase()));
  function shortlist(id: string) { setShortlisted((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]); }
  function saveProperty(next: Match) { setProperties((all) => all.some((item) => item.id === next.id) ? all.map((item) => item.id === next.id ? next : item) : [next, ...all]); setEditing(null); notify("Property saved to fake inventory"); }
  return <div className="module-stack">
    <div className="inventory-summary"><div><span>248</span><small>Active listings</small></div><div><span>42</span><small>Added this week</small></div><div><span>91%</span><small>Average data quality</small></div><div><span>6</span><small>Possible duplicates</small></div></div>
    <Toolbar search={search} setSearch={setSearch}>
      <button className="control-button"><Filter size={15} />Filters <span>2</span></button>
      <button className="control-button" onClick={() => setLayout(layout === "grid" ? "list" : "grid")}><Building2 size={15} />{layout === "grid" ? "List" : "Grid"}</button>
      <button className="control-button" onClick={() => setEditing("new")}><Plus size={15} />Add manually</button>
      <button className="primary-button" onClick={() => setImporting(true)}><Upload size={16} />Import</button>
    </Toolbar>
    <div className={layout === "grid" ? "property-grid-large" : "property-grid-large list"}>
      {filtered.map((property, index) => <article className="inventory-card" key={property.id}>
        <div className="inventory-photo" style={{ backgroundImage: `url(${property.image})` }}><span>{index === 0 ? "VERIFIED" : property.completion.toUpperCase()}</span><button className={shortlisted.includes(property.id) ? "saved" : ""} onClick={() => shortlist(property.id)}><Bookmark size={17} /></button></div>
        <div className="inventory-body"><div className="inventory-title"><h3>{property.title}</h3><span className="mini-actions"><button onClick={() => setEditing(property)} aria-label="Edit property"><Pencil size={15} /></button><button onClick={() => setDeleting(property)} aria-label="Delete property"><Trash2 size={15} /></button></span></div><p><MapPin size={13} />{property.area}</p><strong>{money.format(property.price)}</strong><div className="property-facts"><span>{property.bedrooms} beds</span><span>{number.format(property.size)} sq ft</span><span>{property.yield}% yield</span></div><div className="quality-row"><span>Data quality <b>{93 - index * 3}%</b></span><div><i style={{ width: `${93 - index * 3}%` }} /></div></div><div className="card-actions"><button onClick={() => setDetail(property)}>View details</button><button onClick={onReport}>Create report</button></div></div>
      </article>)}
      <article className="inventory-card placeholder-property"><Building2 size={35} /><h3>Import more inventory</h3><p>Upload portal JSON, CSV, or a developer brochure.</p><button className="ghost-button" onClick={() => setImporting(true)}>Choose file</button></article>
    </div>
    {editing && <PropertyCrudModal property={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} onSave={saveProperty} />}
    {detail && <PropertyDetailModal property={detail} onClose={() => setDetail(null)} onEdit={() => { setDetail(null); setEditing(detail); }} onReport={onReport} />}
    {importing && <ImportWizard onClose={() => setImporting(false)} onComplete={() => { setImporting(false); notify("42 records normalized: 38 added, 4 updated, 3 warnings"); }} />}
    {deleting && <ConfirmModal title="Archive property?" message={`${deleting.title} will disappear from inventory and future recommendations. Existing reports remain unchanged.`} confirmLabel="Archive property" onCancel={() => setDeleting(null)} onConfirm={() => { setProperties((all) => all.filter((item) => item.id !== deleting.id)); setDeleting(null); notify("Property archived"); }} />}
  </div>;
}

export function RecommendationsView({ buyer, matches, onReport, notify }: Props) {
  const [hidden, setHidden] = useState<string[]>([]);
  return <div className="module-stack">
    <section className="recommendation-header"><div><span><Target size={15} />ACTIVE BUYER</span><h2>{buyer.name}</h2><p>{money.format(buyer.budgetMin)}–{money.format(buyer.budgetMax)} · {buyer.bedrooms} beds · {buyer.areas.join(", ")}</p></div><button className="ghost-button">Change buyer <ChevronDown size={15} /></button></section>
    <div className="fit-legend"><span>Match score weights</span><div><i className="budget" />Budget 36%</div><div><i className="location" />Location 28%</div><div><i className="needs" />Needs 20%</div><div><i className="invest" />Investment 16%</div><button onClick={() => notify("Score weights are visible and auditable")}>How scoring works</button></div>
    <div className="ranked-list">{matches.filter((item) => !hidden.includes(item.id)).map((match, index) => <article key={match.id} className="ranked-card"><div className="rank-number">#{index + 1}</div><div className="rank-photo" style={{ backgroundImage: `url(${match.image})` }} /><div className="rank-info"><span>{match.area} · {match.completion}</span><h3>{match.title}</h3><strong>{money.format(match.price)}</strong><ul>{match.reasons.slice(0, 3).map((reason) => <li key={reason}><Check size={14} />{reason}</li>)}</ul></div><div className="score-column"><div className="mini-score"><strong>{match.score}%</strong><span>Buyer fit</span></div><button className="primary-button" onClick={onReport}>Build report</button><button className="text-button" onClick={() => setHidden([...hidden, match.id])}>Hide match</button></div></article>)}</div>
  </div>;
}

export function ReportsView({ onReport, notify }: Props) {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState(demoReports);
  const [editing, setEditing] = useState<DemoReport | "new" | null>(null);
  const [deleting, setDeleting] = useState<DemoReport | null>(null);
  const visible = reports.filter((report) => (report.title + report.buyer).toLowerCase().includes(search.toLowerCase()));
  function saveReport(next: DemoReport) { setReports((all) => all.some((item) => item.id === next.id) ? all.map((item) => item.id === next.id ? next : item) : [next, ...all]); setEditing(null); notify("Report draft saved"); }
  return <div className="module-stack">
    <div className="template-row"><Template icon={FileBarChart} title="Investor report" detail="Yield, comparables, risk" onClick={() => setEditing("new")} /><Template icon={Users} title="Family relocation" detail="Schools, commute, lifestyle" onClick={() => setEditing("new")} /><Template icon={Building2} title="Property comparison" detail="Compare up to 5 options" onClick={() => setEditing("new")} /><button className="new-template" onClick={() => setEditing("new")}><Plus /><span>New report</span></button></div>
    <Toolbar search={search} setSearch={setSearch}><button className="control-button"><Filter size={15} />All types</button><button className="primary-button" onClick={() => setEditing("new")}><WandSparkles size={16} />Create report</button></Toolbar>
    <section className="data-card reports-table"><div className="report-table-head"><span>Report</span><span>Type</span><span>Status</span><span>Engagement</span><span>Updated</span><span /></div>{visible.map((report) => <div className="report-row" key={report.id}><span><i><FileText size={17} /></i><b>{report.title}<small>{report.buyer}</small></b></span><span>{report.type}</span><span><em className={`status-chip ${report.status.toLowerCase()}`}>{report.status}</em></span><span>{report.views ? <><Eye size={14} />{report.views} views</> : "Not shared"}</span><span>{report.updated}</span><span className="inline-actions"><button onClick={() => setEditing(report)} aria-label="Edit report"><Pencil size={16} /></button><button onClick={() => notify("Secure public link copied")} aria-label="Copy link"><Link2 size={16} /></button><button onClick={() => notify("PDF export prepared")} aria-label="Export PDF"><Download size={16} /></button><button onClick={() => setDeleting(report)} aria-label="Delete report"><Trash2 size={16} /></button></span></div>)}</section>
    {editing && <ReportCrudModal report={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} onSave={saveReport} onGenerate={() => { setEditing(null); onReport(); }} />}
    {deleting && <ConfirmModal title="Delete report?" message={`Delete “${deleting.title}”? Any active public link will be disabled.`} onCancel={() => setDeleting(null)} onConfirm={() => { setReports((all) => all.filter((item) => item.id !== deleting.id)); setDeleting(null); notify("Report deleted"); }} />}
  </div>;
}

export function SavedSearchesView({ notify }: Props) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(savedSearches);
  const [editing, setEditing] = useState<SavedSearch | "new" | null>(null);
  const [deleting, setDeleting] = useState<SavedSearch | null>(null);
  function save(next: SavedSearch) { setItems((all) => all.some((item) => item.id === next.id) ? all.map((item) => item.id === next.id ? next : item) : [next, ...all]); setEditing(null); notify("Saved search updated"); }
  return <div className="module-stack"><div className="feed-banner"><Bell size={21} /><div><h3>10 new buyer matches today</h3><p>New listings are grouped by buyer and ranked automatically.</p></div><button onClick={() => notify("New match feed opened")}>Open match feed <ArrowRight size={16} /></button></div><Toolbar search={search} setSearch={setSearch}><button className="primary-button" onClick={() => setEditing("new")}><Plus size={16} />New saved search</button></Toolbar><div className="saved-grid">{items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item) => <article key={item.id}><div className="saved-head"><div className="saved-icon"><Bookmark size={18} /></div><div className="saved-card-actions"><button onClick={() => setEditing(item)} aria-label="Edit saved search"><Pencil size={15} /></button><button onClick={() => setDeleting(item)} aria-label="Delete saved search"><Trash2 size={15} /></button><button onClick={() => setItems(items.map((current) => current.id === item.id ? { ...current, active: !current.active } : current))} className={item.active ? "toggle on" : "toggle"}><i /></button></div></div><h3>{item.name}</h3><p>{item.buyer}</p><div className="criteria">{item.criteria}</div><div className="saved-result"><span><b>{item.matches}</b> total matches</span><em>{item.newMatches} new</em></div><button className="card-primary" onClick={() => notify(`${item.matches} matches loaded`)}>Run search <ArrowRight size={15} /></button></article>)}</div>{editing && <SavedSearchModal item={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} onSave={save} />}{deleting && <ConfirmModal title="Delete saved search?" message={`Alerts and new-match tracking for “${deleting.name}” will stop.`} onCancel={() => setDeleting(null)} onConfirm={() => { setItems((all) => all.filter((item) => item.id !== deleting.id)); setDeleting(null); notify("Saved search deleted"); }} />}</div>;
}

export function MarketView({ notify }: Props) {
  const [area, setArea] = useState("All Dubai");
  const [selectedArea, setSelectedArea] = useState<(typeof marketAreas)[number] | null>(null);
  const [calculator, setCalculator] = useState(false);
  const [methodology, setMethodology] = useState(false);
  return <div className="module-stack"><div className="market-controls"><div><span>Market scope</span><select value={area} onChange={(e) => setArea(e.target.value)}><option>All Dubai</option>{marketAreas.map((item) => <option key={item.area}>{item.area}</option>)}</select></div><div><span>Property type</span><select><option>Apartments</option><option>Villas</option><option>Townhouses</option></select></div><div><span>Period</span><select><option>Last 90 days</option><option>Last 12 months</option></select></div><button className="secondary-button" onClick={() => setCalculator(true)}><Gauge size={16} />Yield calculator</button><button className="secondary-button" onClick={() => notify("Market snapshot exported")}><Download size={16} />Export</button></div><div className="market-kpis"><Metric icon={CircleDollarSign} label="Median sale price" value="AED 2.74M" delta="+4.6%" /><Metric icon={Gauge} label="Median price / m²" value="AED 24,450" delta="+2.9%" /><Metric icon={TrendingUp} label="Estimated gross yield" value="6.1%" delta="+0.3%" /><Metric icon={Building2} label="Active listings" value="1,507" delta="+8.2%" /></div><div className="two-column market-layout"><section className="data-card"><div className="section-title"><div><h3>Area benchmarks</h3><p>Listing and transaction-led indicators</p></div><button onClick={() => setMethodology(true)}>View methodology</button></div><div className="benchmark-head"><span>Area</span><span>Median</span><span>AED/m²</span><span>Yield</span><span>Trend</span></div>{marketAreas.map((item) => <button className="benchmark-row" onClick={() => setSelectedArea(item)} key={item.area}><span><MapPin size={14} />{item.area}</span><span>{item.median}</span><span>{item.sqm}</span><span>{item.yield}</span><span className="positive">{item.trend}</span></button>)}</section><section className="data-card signal-card"><div className="section-title"><div><h3>Live broker signals</h3><p>Based on workspace buyer demand</p></div></div><Signal value="38%" label="of qualified buyers request Dubai Hills" /><Signal value="AED 2–3M" label="is the most active budget band" /><Signal value="2 bed" label="is the most recommended unit type" /><div className="dld-box"><ShieldCheck size={18} /><p><strong>DLD comparables ready</strong>Source dates and assumptions appear on every client-facing analysis.</p></div></section></div>{selectedArea && <AreaDetailModal item={selectedArea} onClose={() => setSelectedArea(null)} />}{calculator && <YieldCalculator onClose={() => setCalculator(false)} />}{methodology && <MethodologyModal onClose={() => setMethodology(false)} />}</div>;
}

export function TeamView({ notify }: Props) {
  const [members, setMembers] = useState(teamMembers);
  const [editing, setEditing] = useState<TeamMember | "new" | null>(null);
  const [deleting, setDeleting] = useState<TeamMember | null>(null);
  function save(next: TeamMember) { setMembers((all) => all.some((item) => item.name === next.name) ? all.map((item) => item.name === next.name ? next : item) : [...all, next]); setEditing(null); notify("Team member saved"); }
  return <div className="module-stack"><div className="team-hero"><div><span>TEAM WORKSPACE</span><h2>Broker performance</h2><p>Shared activity, quality, and buyer progress across the team.</p></div><button className="primary-button" onClick={() => setEditing("new")}><UserPlus size={16} />Invite member</button></div><div className="market-kpis"><Metric icon={Users} label="Active brokers" value={String(members.filter((item) => item.role !== "Viewer").length)} delta="All active" /><Metric icon={FileText} label="Reports generated" value="43" delta="+18%" /><Metric icon={Target} label="Qualified buyers" value="21" delta="+5 this week" /><Metric icon={TrendingUp} label="Viewing conversion" value="32%" delta="+4.1%" /></div><section className="data-card team-table"><div className="team-head"><span>Team member</span><span>Role</span><span>Active buyers</span><span>Reports</span><span>Last active</span><span /></div>{members.map((member) => <div className="team-row" key={member.name}><span className="buyer-cell"><i>{member.initials}</i><b>{member.name}<small>{member.role === "Owner" ? "Workspace owner" : "Dubai sales"}</small></b></span><span><em className="role-chip">{member.role}</em></span><span>{member.buyers}</span><span>{member.reports}</span><span>{member.activity}</span><span className="mini-actions"><button onClick={() => setEditing(member)} aria-label="Edit member"><Pencil size={15} /></button>{member.role !== "Owner" && <button onClick={() => setDeleting(member)} aria-label="Remove member"><Trash2 size={15} /></button>}</span></div>)}</section>{editing && <TeamMemberModal member={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} onSave={save} />}{deleting && <ConfirmModal title="Remove team member?" message={`${deleting.name} will lose access. Their buyers and reports remain in the workspace.`} confirmLabel="Remove access" onCancel={() => setDeleting(null)} onConfirm={() => { setMembers((all) => all.filter((item) => item.name !== deleting.name)); setDeleting(null); notify("Member access removed"); }} />}</div>;
}

function ActivityView(): React.ReactNode {
  const [kind, setKind] = useState("All activity");
  const visible = activityEvents.filter((event) => kind === "All activity" || (kind === "Reports" && event.icon === "report") || (kind === "Buyers" && event.icon === "buyer") || (kind === "Imports" && event.icon === "property"));
  return <div className="module-stack"><div className="activity-filter"><button className={kind === "All activity" ? "active" : ""} onClick={() => setKind("All activity")}>All activity</button><button className={kind === "Reports" ? "active" : ""} onClick={() => setKind("Reports")}>Reports</button><button className={kind === "Buyers" ? "active" : ""} onClick={() => setKind("Buyers")}>Buyers</button><button className={kind === "Imports" ? "active" : ""} onClick={() => setKind("Imports")}>Imports</button></div><section className="data-card timeline-card"><div className="date-divider">TODAY</div>{visible.map((event, index) => <div className="timeline-event" key={event.title}><div className={`timeline-icon ${event.icon}`}>{event.icon === "report" ? <FileText /> : event.icon === "buyer" ? <Users /> : event.icon === "property" ? <Building2 /> : event.icon === "message" ? <MessageCircle /> : <Settings />}</div><div><strong>{event.title}</strong><p>{event.detail}</p><span>{event.user} · {event.time}</span></div>{index < visible.length - 1 && <i className="timeline-line" />}</div>)}{visible.length === 0 && <div className="empty-state"><Activity size={24} /><strong>No activity in this filter</strong></div>}</section></div>;
}

export function AdminView({ notify }: Props) {
  const [review, setReview] = useState(true);
  return <div className="module-stack"><div className="admin-grid"><section className="settings-card"><div className="settings-card-head"><ShieldCheck /><div><h3>Workspace controls</h3><p>Permissions and quality safeguards</p></div></div><SettingToggle label="Require AI report review" detail="Reports stay in draft until approved" value={review} setValue={setReview} /><SettingToggle label="Lock agency branding" detail="Agents cannot change logo or disclaimer" value={true} /><SettingToggle label="Allow agent imports" detail="Brokers can add inventory sources" value={false} /></section><section className="settings-card"><div className="settings-card-head"><Gauge /><div><h3>Plan & usage</h3><p>Solo Pro · June cycle</p></div></div><Usage label="Reports" used={18} total={30} /><Usage label="AI generations" used={76} total={150} /><Usage label="Buyer profiles" used={12} total={50} /><button className="ghost-button full-width" onClick={() => notify("Upgrade request prepared")}>Compare plans</button></section></div><section className="data-card endpoint-preview"><div className="section-title"><div><h3>Backend readiness</h3><p>Frontend actions are mapped to the planned API</p></div><span>{Object.values(apiEndpoints).flat().length} endpoints</span></div><div className="endpoint-groups">{Object.entries(apiEndpoints).slice(0, 8).map(([group, endpoints]) => <div key={group}><strong>{group}</strong><span>{endpoints.length} routes prepared</span><Check size={15} /></div>)}</div></section></div>;
}

function SettingsView({ notify }: Props) {
  const [language, setLanguage] = useState("English");
  const [color, setColor] = useState("#0d756c");
  const [tab, setTab] = useState("Branding");
  const tabs = [{ name: "Branding", icon: Palette }, { name: "Broker profile", icon: Users }, { name: "AI defaults", icon: Languages }, { name: "Notifications", icon: Bell }, { name: "Integrations", icon: Link2 }];
  return <div className="module-stack"><div className="settings-nav">{tabs.map(({ name, icon: Icon }) => <button key={name} className={tab === name ? "active" : ""} onClick={() => setTab(name)}><Icon />{name}</button>)}</div>
    {tab === "Branding" && <div className="settings-layout"><section className="settings-card brand-editor"><div className="section-title"><div><h3>Workspace branding</h3><p>Applied to PDFs and public report links</p></div></div><label>Workspace name<input defaultValue="Zied Properties" /></label><label>Logo<div className="logo-upload"><div className="brand-mark-preview">ZP</div><button className="ghost-button" onClick={() => notify("Logo upload selector opened")}><Upload size={15} />Replace logo</button></div></label><div className="color-fields"><label>Primary colour<div><input type="color" value={color} onChange={(e) => setColor(e.target.value)} /><input value={color} onChange={(e) => setColor(e.target.value)} /></div></label><label>Secondary colour<div><input type="color" defaultValue="#c69b55" /><input defaultValue="#c69b55" /></div></label></div><label>Default disclaimer<textarea defaultValue="Market insights are generated using available listing, neighbourhood, and transaction data where available. Final property decisions should be verified with official sources and licensed professionals." /></label><label>Default output language<select value={language} onChange={(e) => setLanguage(e.target.value)}><option>English</option><option>Arabic</option><option>French</option></select></label><button className="primary-button" onClick={() => notify("Brand settings saved locally")}>Save changes</button></section><aside className="brand-preview" style={{ "--preview-color": color } as React.CSSProperties}><span>LIVE PREVIEW</span><div className="report-cover"><div className="preview-brand">ZP</div><p>PERSONALISED PROPERTY ANALYSIS</p><h3>Marina Vista<br />Investment Case</h3><small>Prepared for Omar Al Mansoori</small><div className="preview-footer">Zied Machkena · RERA 12345</div></div></aside></div>}
    {tab === "Broker profile" && <SimpleSettingsForm title="Personal broker profile" description="Used on reports, shared links, and client communication." notify={notify}><div className="profile-photo-edit"><div className="large-avatar">ZM</div><button className="ghost-button"><Upload size={15} />Upload photo</button></div><div className="crud-grid"><label>Full name<input defaultValue="Zied Machkena" /></label><label>RERA number<input defaultValue="12345" /></label><label>Phone<input defaultValue="+971 50 000 0000" /></label><label>WhatsApp<input defaultValue="+971 50 000 0000" /></label><label>Email<input defaultValue="zied@example.com" /></label><label>Languages<input defaultValue="English, Arabic, French" /></label><label className="span-2">Specialisation<input defaultValue="Investment property · Dubai Marina · Dubai Hills" /></label><label className="span-2">Professional bio<textarea defaultValue="Independent Dubai real estate advisor focused on transparent, data-backed property recommendations." /></label></div></SimpleSettingsForm>}
    {tab === "AI defaults" && <SimpleSettingsForm title="AI content defaults" description="Starting settings for reports and sales content." notify={notify}><div className="crud-grid"><label>Default language<select><option>English</option><option>Arabic</option><option>French</option></select></label><label>Default tone<select><option>Advisory</option><option>Professional</option><option>Luxury</option><option>Investor-focused</option></select></label><label>Message length<select><option>Short WhatsApp</option><option>Balanced</option><option>Detailed advisory</option></select></label><label>Report style<select><option>Premium</option><option>Minimal</option><option>Data-heavy</option></select></label></div><div className="generation-preview"><Sparkles size={18} /><div><strong>Preview output style</strong><p>Concise, confident recommendations that explain fit and assumptions without unsupported promises.</p></div></div></SimpleSettingsForm>}
    {tab === "Notifications" && <SimpleSettingsForm title="Notification preferences" description="Control alerts for matches, follow-ups, and team events." notify={notify}><SettingToggle label="New property matches" detail="When a saved buyer search finds fresh inventory" value={true} /><SettingToggle label="Follow-up reminders" detail="Daily due and overdue follow-up summary" value={true} /><SettingToggle label="Report views" detail="When a client opens a public report" value={true} /><SettingToggle label="Import warnings" detail="Data quality and duplicate review alerts" value={false} /></SimpleSettingsForm>}
    {tab === "Integrations" && <SimpleSettingsForm title="Integrations" description="Connections are simulated until the backend is added." notify={notify}><Integration name="WhatsApp Business" detail="Send generated messages and track delivery" connected={false} notify={notify} /><Integration name="CRM webhook" detail="Push buyers, reports, and status changes" connected={true} notify={notify} /><Integration name="DLD market data" detail="Comparable transactions and area benchmarks" connected={true} notify={notify} /><Integration name="Property portals" detail="Bayut, Dubizzle, and Property Finder imports" connected={false} notify={notify} /></SimpleSettingsForm>}
  </div>;
}

function EmptyView({ active, onReport }: Props) { return <section className="workspace-panel"><div className="workspace-hero"><span><Sparkles size={15} />Frontend module</span><h2>{active}</h2><p>This workflow is represented in the interactive frontend and included in the backend API contract.</p><button className="primary-button" onClick={onReport}>Open report workflow <ArrowRight size={16} /></button></div></section>; }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="info-row"><span>{label}</span><strong>{value}</strong></div>; }

function BuyerCrudModal({ buyer, onClose, onSave }: { buyer?: DemoBuyer; onClose: () => void; onSave: (buyer: DemoBuyer) => void }) {
  const [draft, setDraft] = useState<DemoBuyer>(buyer ?? { id: `buy_${Date.now()}`, name: "", initials: "", persona: "Family end-user", budget: "AED 1.5M–2.5M", areas: "Dubai Hills", status: "New lead", owner: "Zied", nextAction: "Complete qualification" });
  function submit(event: React.FormEvent) { event.preventDefault(); const initials = draft.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); onSave({ ...draft, initials: initials || "NB" }); }
  return <UiModal title={buyer ? "Edit buyer" : "Create buyer"} subtitle="Qualification details are used by matching, reports, and sales content." onClose={onClose} size="large"><form className="crud-form" onSubmit={submit}><div className="form-section-title">Contact & ownership</div><div className="crud-grid"><label className="span-2">Full name<input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Buyer full name" /></label><label>Assigned broker<select value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })}><option>Zied</option><option>Maya</option><option>Rami</option><option>Unassigned</option></select></label><label>Status<select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option>New lead</option><option>Qualified</option><option>Shortlist sent</option><option>Viewing scheduled</option><option>Negotiation</option><option>Won</option><option>Lost</option></select></label></div><div className="form-section-title">Property requirements</div><div className="crud-grid"><label>Buyer persona<select value={draft.persona} onChange={(e) => setDraft({ ...draft, persona: e.target.value })}><option>Family end-user</option><option>Yield investor</option><option>Capital growth investor</option><option>Relocation buyer</option><option>Off-plan investor</option><option>Luxury lifestyle buyer</option></select></label><label>Budget range<input required value={draft.budget} onChange={(e) => setDraft({ ...draft, budget: e.target.value })} /></label><label className="span-2">Preferred areas<input required value={draft.areas} onChange={(e) => setDraft({ ...draft, areas: e.target.value })} /></label><label className="span-2">Next action<input value={draft.nextAction} onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })} /></label></div><div className="form-notice"><ShieldCheck size={16} /><span>By saving, the broker confirms a lawful basis to store and use the buyer’s information for property recommendations.</span></div><FormActions onCancel={onClose} submitLabel={buyer ? "Save buyer" : "Create & match"} /></form></UiModal>;
}

function PropertyCrudModal({ property, onClose, onSave }: { property?: Match; onClose: () => void; onSave: (property: Match) => void }) {
  const [draft, setDraft] = useState<Match>(property ?? { id: `prop_${Date.now()}`, title: "", area: "Dubai Marina", price: 2_500_000, bedrooms: 2, propertyType: "Apartment", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", size: 1100, yield: 6.2, completion: "Ready", score: 82, reasons: ["Inside the buyer budget", "Strong location and bedroom fit"] });
  return <UiModal title={property ? "Edit property" : "Add property manually"} subtitle="The same normalized fields are used for portal imports and brochure extraction." onClose={onClose} size="large"><form className="crud-form" onSubmit={(e) => { e.preventDefault(); onSave(draft); }}><div className="crud-grid"><label className="span-2">Listing title<input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Marina Vista · Full Sea View" /></label><label>Neighbourhood<input required value={draft.area} onChange={(e) => setDraft({ ...draft, area: e.target.value })} /></label><label>Property type<select value={draft.propertyType} onChange={(e) => setDraft({ ...draft, propertyType: e.target.value })}><option>Apartment</option><option>Villa</option><option>Townhouse</option><option>Penthouse</option></select></label><label>Price (AED)<input type="number" min="0" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} /></label><label>Bedrooms<input type="number" min="0" value={draft.bedrooms} onChange={(e) => setDraft({ ...draft, bedrooms: Number(e.target.value) })} /></label><label>Size (sq ft)<input type="number" min="0" value={draft.size} onChange={(e) => setDraft({ ...draft, size: Number(e.target.value) })} /></label><label>Estimated gross yield %<input type="number" step="0.1" value={draft.yield} onChange={(e) => setDraft({ ...draft, yield: Number(e.target.value) })} /></label><label>Completion<select value={draft.completion} onChange={(e) => setDraft({ ...draft, completion: e.target.value })}><option>Ready</option><option>Off-plan</option><option>Under construction</option></select></label><label>Image URL<input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} /></label></div><div className="form-notice"><AlertCircle size={16} /><span>Price, location, size, and bedroom data directly affect matching and report quality.</span></div><FormActions onCancel={onClose} submitLabel={property ? "Save property" : "Add to inventory"} /></form></UiModal>;
}

function PropertyDetailModal({ property, onClose, onEdit, onReport }: { property: Match; onClose: () => void; onEdit: () => void; onReport: () => void }) {
  return <UiModal title={property.title} subtitle={`${property.area} · ${property.completion}`} onClose={onClose} size="large"><div className="property-detail-modal"><div className="detail-hero" style={{ backgroundImage: `url(${property.image})` }}><span>{property.score}% BUYER MATCH</span></div><div className="detail-kpis"><div><span>Price</span><strong>{money.format(property.price)}</strong></div><div><span>Bedrooms</span><strong>{property.bedrooms}</strong></div><div><span>Area</span><strong>{number.format(property.size)} sq ft</strong></div><div><span>Gross yield</span><strong>{property.yield}%</strong></div></div><div className="detail-columns"><div><h4>Buyer-fit reasoning</h4><ul>{property.reasons.map((reason) => <li key={reason}><Check size={14} />{reason}</li>)}</ul></div><div><h4>Nearby highlights</h4><p>Dubai Marina Mall · 6 min</p><p>DMCC Metro · 8 min</p><p>Emirates International School · 14 min</p></div></div></div><div className="form-actions"><button className="ghost-button" onClick={onEdit}><Pencil size={15} />Edit</button><button className="primary-button" onClick={onReport}><FileText size={15} />Create report</button></div></UiModal>;
}

function ImportWizard({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState("Bayut JSON");
  return <UiModal title="Import property inventory" subtitle="Normalize portal files and brochures into one property schema." onClose={onClose} size="large"><div className="wizard-steps"><span className={step >= 1 ? "active" : ""}><i>1</i>Source</span><b /><span className={step >= 2 ? "active" : ""}><i>2</i>Review</span><b /><span className={step >= 3 ? "active" : ""}><i>3</i>Result</span></div>{step === 1 && <div className="import-source-grid">{["Bayut JSON", "Dubizzle JSON", "CSV inventory", "PDF brochure"].map((item) => <button className={source === item ? "selected" : ""} onClick={() => setSource(item)} key={item}><Upload size={21} /><strong>{item}</strong><small>Upload and normalize</small></button>)}<div className="drop-zone"><Upload size={25} /><strong>Drop a file here</strong><span>or browse your computer · max 25 MB</span><input aria-label="Choose import file" type="file" /></div></div>}{step === 2 && <div className="import-review"><div><Check /><strong>dubai_inventory_june.json</strong><span>42 records detected · {source}</span></div><table><thead><tr><th>Detected field</th><th>Maps to</th><th>Sample</th></tr></thead><tbody><tr><td>listing_id</td><td>External ID</td><td>BY-983410</td></tr><tr><td>location.name</td><td>Neighbourhood</td><td>Dubai Marina</td></tr><tr><td>price</td><td>Price AED</td><td>2,750,000</td></tr><tr><td>rooms</td><td>Bedrooms</td><td>2</td></tr></tbody></table></div>}{step === 3 && <div className="import-result"><i><Check size={27} /></i><h3>Inventory is ready</h3><p>38 properties will be added, 4 updated, and 3 records need review.</p><div><span><b>38</b>New</span><span><b>4</b>Updated</span><span><b>3</b>Warnings</span></div></div>}<div className="form-actions"><button className="ghost-button" onClick={step === 1 ? onClose : () => setStep(step - 1)}>{step === 1 ? "Cancel" : "Back"}</button>{step < 3 ? <button className="primary-button" onClick={() => setStep(step + 1)}>{step === 1 ? "Review mapping" : "Run import"}</button> : <button className="primary-button" onClick={onComplete}>Finish import</button>}</div></UiModal>;
}

function ReportCrudModal({ report, onClose, onSave, onGenerate }: { report?: DemoReport; onClose: () => void; onSave: (report: DemoReport) => void; onGenerate: () => void }) {
  const [draft, setDraft] = useState<DemoReport>(report ?? { id: `rep_${Date.now()}`, title: "", buyer: "Omar Al Mansoori", type: "Investor report", status: "Draft", updated: "Just now", views: 0 });
  return <UiModal title={report ? "Edit report setup" : "Create client report"} subtitle="Choose the buyer, report format, and output rules before generation." onClose={onClose} size="large"><form className="crud-form" onSubmit={(e) => { e.preventDefault(); onSave(draft); }}><div className="crud-grid"><label className="span-2">Report title<input required value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Marina investment shortlist" /></label><label>Buyer<select value={draft.buyer} onChange={(e) => setDraft({ ...draft, buyer: e.target.value })}>{demoBuyers.map((item) => <option key={item.id}>{item.name}</option>)}</select></label><label>Template<select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}><option>Investor report</option><option>Family relocation</option><option>Property comparison</option><option>Luxury buyer</option><option>Short recommendation</option><option>Off-plan report</option></select></label><label>Language<select><option>English</option><option>Arabic</option><option>French</option></select></label><label>Tone<select><option>Advisory</option><option>Professional</option><option>Luxury</option><option>Investor-focused</option></select></label><label className="span-2">Properties<div className="check-list">{["Marina Vista · Full Sea View", "Park Heights · Boulevard View", "Creek Palace · Skyline Residence"].map((item, index) => <label key={item}><input type="checkbox" defaultChecked={index < 2} />{item}</label>)}</div></label></div><div className="report-options"><label><input type="checkbox" defaultChecked /> Include buyer-fit matrix</label><label><input type="checkbox" defaultChecked /> Include DLD comparables</label><label><input type="checkbox" defaultChecked /> Add AI disclaimer</label></div><div className="form-actions"><button type="button" className="ghost-button" onClick={onClose}>Cancel</button><button type="submit" className="ghost-button">Save draft</button><button type="button" className="primary-button" onClick={onGenerate}><WandSparkles size={15} />Generate preview</button></div></form></UiModal>;
}

function SavedSearchModal({ item, onClose, onSave }: { item?: SavedSearch; onClose: () => void; onSave: (item: SavedSearch) => void }) {
  const [draft, setDraft] = useState<SavedSearch>(item ?? { id: `search_${Date.now()}`, name: "", buyer: "Omar Al Mansoori", criteria: "Buy · 2 bed · AED 2–3M · Ready", matches: 0, newMatches: 0, active: true });
  const [purpose, setPurpose] = useState("Buy"); const [beds, setBeds] = useState("2"); const [area, setArea] = useState("Dubai Marina"); const [budget, setBudget] = useState("AED 2–3M");
  return <UiModal title={item ? "Edit saved search" : "Create saved search"} subtitle="Link repeatable inventory filters to a buyer and optional alert." onClose={onClose} size="large"><form className="crud-form" onSubmit={(e) => { e.preventDefault(); onSave({ ...draft, criteria: `${purpose} · ${beds} bed · ${budget} · ${area}` }); }}><div className="crud-grid"><label className="span-2">Search name<input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Omar · Marina yield" /></label><label>Buyer<select value={draft.buyer} onChange={(e) => setDraft({ ...draft, buyer: e.target.value })}>{demoBuyers.map((buyer) => <option key={buyer.id}>{buyer.name}</option>)}</select></label><label>Purpose<select value={purpose} onChange={(e) => setPurpose(e.target.value)}><option>Buy</option><option>Rent</option></select></label><label>Area<input value={area} onChange={(e) => setArea(e.target.value)} /></label><label>Bedrooms<select value={beds} onChange={(e) => setBeds(e.target.value)}><option>Studio</option><option>1</option><option>2</option><option>3</option><option>4+</option></select></label><label>Budget range<input value={budget} onChange={(e) => setBudget(e.target.value)} /></label><label>Completion<select><option>Any</option><option>Ready</option><option>Off-plan</option></select></label></div><div className="setting-toggle standalone"><div><strong>New-match alerts</strong><p>Show an in-app alert when fresh inventory matches.</p></div><button type="button" className={draft.active ? "toggle on" : "toggle"} onClick={() => setDraft({ ...draft, active: !draft.active })}><i /></button></div><FormActions onCancel={onClose} submitLabel={item ? "Save search" : "Create search"} /></form></UiModal>;
}

function TeamMemberModal({ member, onClose, onSave }: { member?: TeamMember; onClose: () => void; onSave: (member: TeamMember) => void }) {
  const [draft, setDraft] = useState<TeamMember>(member ?? { name: "", initials: "", role: "Broker", buyers: 0, reports: 0, activity: "Invitation pending" });
  return <UiModal title={member ? "Edit team member" : "Invite team member"} subtitle="Permissions follow the selected workspace role." onClose={onClose}><form className="crud-form" onSubmit={(e) => { e.preventDefault(); const initials = draft.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); onSave({ ...draft, initials: initials || "TM" }); }}><div className="crud-grid"><label className="span-2">Full name<input required value={draft.name} disabled={Boolean(member)} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label><label className="span-2">Email address<input required type="email" defaultValue={member ? `${member.name.toLowerCase().replaceAll(" ", ".")}@example.com` : ""} placeholder="broker@agency.com" /></label><label>Role<select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })}><option>Admin</option><option>Manager</option><option>Broker</option><option>Viewer</option></select></label><label>Buyer visibility<select><option>Assigned + shared</option><option>Assigned only</option><option>All workspace buyers</option></select></label></div><div className="permission-summary"><ShieldCheck size={17} /><div><strong>{draft.role} access</strong><p>{draft.role === "Viewer" ? "Can view permitted records but cannot create or edit." : "Can manage assigned buyers, shared inventory, reports, and sales content."}</p></div></div><FormActions onCancel={onClose} submitLabel={member ? "Save permissions" : "Send invitation"} /></form></UiModal>;
}

function AreaDetailModal({ item, onClose }: { item: (typeof marketAreas)[number]; onClose: () => void }) {
  return <UiModal title={item.area} subtitle="Area benchmark and demand snapshot" onClose={onClose} size="large"><div className="area-modal"><div className="detail-kpis"><div><span>Median sale price</span><strong>{item.median}</strong></div><div><span>Price / m²</span><strong>{item.sqm}</strong></div><div><span>Gross yield</span><strong>{item.yield}</strong></div><div><span>90-day trend</span><strong className="positive">{item.trend}</strong></div></div><div className="fake-chart"><div style={{ height: "32%" }} /><div style={{ height: "47%" }} /><div style={{ height: "41%" }} /><div style={{ height: "59%" }} /><div style={{ height: "68%" }} /><div style={{ height: "64%" }} /><div style={{ height: "82%" }} /><div style={{ height: "88%" }} /></div><div className="detail-columns"><div><h4>Buyer demand</h4><p>Most requested: 2-bedroom apartments</p><p>Active budget: AED 2M–3M</p><p>Qualified workspace buyers: 7</p></div><div><h4>Data provenance</h4><p>Listings sample: {item.listings}</p><p>DLD comparables: 126 transactions</p><p>As of: 24 June 2026</p></div></div></div><div className="form-actions"><button className="primary-button" onClick={onClose}>Done</button></div></UiModal>;
}

function YieldCalculator({ onClose }: { onClose: () => void }) {
  const [price, setPrice] = useState(2_500_000); const [rent, setRent] = useState(165_000); const [fees, setFees] = useState(18_000); const gross = price ? rent / price * 100 : 0; const net = price ? (rent - fees) / price * 100 : 0;
  return <UiModal title="Rental yield calculator" subtitle="Transparent estimates with editable assumptions." onClose={onClose}><div className="crud-form"><div className="crud-grid"><label>Purchase price (AED)<input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} /></label><label>Expected annual rent<input type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))} /></label><label className="span-2">Annual service/operating costs<input type="number" value={fees} onChange={(e) => setFees(Number(e.target.value))} /></label></div><div className="yield-result"><div><span>Gross yield</span><strong>{gross.toFixed(2)}%</strong></div><div><span>Indicative net yield</span><strong>{net.toFixed(2)}%</strong></div></div><div className="form-notice"><AlertCircle size={16} /><span>This estimate excludes financing, acquisition costs, vacancy, and tax considerations.</span></div><div className="form-actions"><button className="ghost-button" onClick={onClose}>Close</button><button className="primary-button" onClick={onClose}>Use in report</button></div></div></UiModal>;
}

function MethodologyModal({ onClose }: { onClose: () => void }) { return <UiModal title="Market methodology" subtitle="How client-facing market indicators should be calculated." onClose={onClose}><div className="methodology-list"><div><i>1</i><p><strong>Comparable scope</strong>Match neighbourhood, property type, bedrooms, and a reasonable size band.</p></div><div><i>2</i><p><strong>Source freshness</strong>Always show the data source date and exclude stale or unverifiable records.</p></div><div><i>3</i><p><strong>Yield assumptions</strong>Separate expected rent, gross yield, service fees, and any manual broker override.</p></div><div><i>4</i><p><strong>No false certainty</strong>Present ranges, sample sizes, and limitations rather than guarantees.</p></div></div><div className="form-actions"><button className="primary-button" onClick={onClose}>Understood</button></div></UiModal>; }

function Template({ icon: Icon, title, detail, onClick }: { icon: typeof FileText; title: string; detail: string; onClick?: () => void }) { return <button className="template-card" onClick={onClick}><i><Icon size={19} /></i><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight size={15} /></button>; }
function Metric({ icon: Icon, label, value, delta }: { icon: typeof Users; label: string; value: string; delta: string }) { return <article><i><Icon size={19} /></i><div><span>{label}</span><strong>{value}</strong><em>{delta}</em></div></article>; }
function Signal({ value, label }: { value: string; label: string }) { return <div className="signal-row"><strong>{value}</strong><span>{label}</span><TrendingUp size={15} /></div>; }
function SettingToggle({ label, detail, value, setValue }: { label: string; detail: string; value: boolean; setValue?: (next: boolean) => void }) { return <div className="setting-toggle"><div><strong>{label}</strong><p>{detail}</p></div><button className={value ? "toggle on" : "toggle"} onClick={() => setValue?.(!value)}><i /></button></div>; }
function Usage({ label, used, total }: { label: string; used: number; total: number }) { return <div className="usage-line"><div><span>{label}</span><strong>{used} / {total}</strong></div><div><i style={{ width: `${used / total * 100}%` }} /></div></div>; }
function SimpleSettingsForm({ title, description, children, notify }: { title: string; description: string; children: React.ReactNode; notify: (message: string) => void }) { return <section className="settings-card simple-settings"><div className="section-title"><div><h3>{title}</h3><p>{description}</p></div></div><div className="simple-settings-body">{children}<button className="primary-button" onClick={() => notify(`${title} saved locally`)}>Save changes</button></div></section>; }
function Integration({ name, detail, connected, notify }: { name: string; detail: string; connected: boolean; notify: (message: string) => void }) { const [active, setActive] = useState(connected); return <div className="integration-row"><i><Link2 size={17} /></i><div><strong>{name}</strong><p>{detail}</p></div><span className={active ? "connected" : ""}>{active ? "Connected" : "Not connected"}</span><button className="ghost-button" onClick={() => { setActive(!active); notify(`${name} ${active ? "disconnected" : "connected"} in demo mode`); }}>{active ? "Disconnect" : "Connect"}</button></div>; }
function slug(value: string) { return value.toLowerCase().replaceAll(" ", "-"); }
