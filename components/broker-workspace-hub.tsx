"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clipboard,
  FileText,
  Gauge,
  MessageCircle,
  RefreshCcw,
  Search,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  Users,
} from "lucide-react";
import { BuyerEpic } from "@/components/buyer-epic";
import { MatchingEpic } from "@/components/matching-epic";
import { ReportStudio } from "@/components/report-studio";
import { SalesCopilot } from "@/components/sales-copilot";
import { SavedSearchAlerts } from "@/components/saved-search-alerts";
import type { BrokerProfile, Workspace } from "@/lib/workspace";
import { initialBuyerProfiles, generateBuyerSummary, type BuyerStatus } from "@/lib/buyer-data";
import { initialProperties } from "@/lib/property-data";
import { generateWhatsAppMessage } from "@/lib/sales-content";
import { aurestCommissionRecords } from "@/lib/aurest-data";
import {
  brokerBuyer,
  brokerCommissionSummary,
  brokerHubTabs,
  brokerPersonalAnalytics,
  brokerPipelineStatuses,
  brokerProperty,
  brokerWorkspaceFeatures,
  initialBrokerFollowUps,
  initialBrokerPipeline,
  initialBrokerShortlists,
  initialBrokerViewings,
  routeToBrokerTab,
  topBrokerMatches,
  type BrokerFollowUpReminder,
  type BrokerFullWorkflow,
  type BrokerHubTab,
  type BrokerPipelineDeal,
  type BrokerShortlist,
  type BrokerViewing,
} from "@/lib/broker-workspace";

type Props = {
  active: string;
  workspace: Workspace;
  profile: BrokerProfile;
  notify: (message: string) => void;
  onReport: () => void;
};

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const money = (value: number) => `AED ${number.format(value)}`;

export function BrokerWorkspaceHub({ active, workspace, profile, notify, onReport }: Props) {
  const [tab, setTab] = useState<BrokerHubTab>(() => routeToBrokerTab(active));
  const [fullWorkflow, setFullWorkflow] = useState<BrokerFullWorkflow | null>(null);
  const [pipeline, setPipeline] = useState(initialBrokerPipeline);
  const [viewings, setViewings] = useState(initialBrokerViewings);
  const [followUps, setFollowUps] = useState(initialBrokerFollowUps);
  const [shortlists, setShortlists] = useState(initialBrokerShortlists);
  const [pitchVersion, setPitchVersion] = useState(1);
  const matches = useMemo(() => topBrokerMatches(5), []);
  const urgent = followUps.filter((item) => !item.done && !item.snoozed);
  const analytics = brokerPersonalAnalytics();
  const selectedBuyer = brokerBuyer(pipeline[0]?.buyerId);
  const selectedProperty = brokerProperty(pipeline[0]?.propertyId);
  const pitch = `${generateWhatsAppMessage("First recommendation", selectedBuyer, selectedProperty, "Short WhatsApp", "English")}${pitchVersion > 1 ? `\n\nVariation ${pitchVersion}: refreshed from Broker Workspace.` : ""}`;

  if (fullWorkflow) {
    return <FullWorkflowShell name={fullWorkflow} onBack={() => setFullWorkflow(null)}>
      {fullWorkflow === "Buyer CRM" && <BuyerEpic notify={notify} onReport={onReport} />}
      {fullWorkflow === "Matching" && <MatchingEpic notify={notify} onReport={onReport} />}
      {fullWorkflow === "Sales Copilot" && <SalesCopilot workspace={workspace} profile={profile} notify={notify} />}
      {fullWorkflow === "Report Studio" && <ReportStudio workspace={workspace} profile={profile} notify={notify} />}
      {fullWorkflow === "Saved Searches" && <SavedSearchAlerts notify={notify} onReport={onReport} />}
    </FullWorkflowShell>;
  }

  return <div className="broker-hub">
    <section className="broker-hub-hero">
      <div>
        <span><Sparkles />BROKER WORKSPACE V2 · BRK-001 → BRK-012</span>
        <h2>Today’s broker priorities, buyer context, matching, pitches and pipeline in one cockpit.</h2>
        <p>Frontend-only demo: all actions use fake local state and existing Aurest modules. No backend calls, calendar sync or WhatsApp send is introduced.</p>
        <div className="button-row">
          <button className="primary-button" onClick={() => setTab("Matching")}><Target />Review best matches</button>
          <button className="ghost-button" onClick={() => setFullWorkflow("Buyer CRM")}><Users />Open full CRM</button>
        </div>
      </div>
      <aside>
        <strong>{matches[0]?.match.score ?? 0}%</strong>
        <span>Top buyer fit</span>
        <small>{matches[0]?.buyer.name} × {matches[0]?.property.neighbourhood}</small>
      </aside>
    </section>

    <section className="broker-hub-kpis">
      <Metric icon={Users} label="Active buyers" value={String(analytics.activeBuyers)} detail={`${analytics.newBuyersThisMonth} new this month`} />
      <Metric icon={FileText} label="Reports" value={String(analytics.reportsGenerated)} detail={`${analytics.usageLimitRemaining} remaining`} />
      <Metric icon={MessageCircle} label="Pitches copied" value={String(analytics.pitchesCopied)} detail="WhatsApp-ready content" />
      <Metric icon={Bell} label="Follow-ups due" value={String(urgent.length)} detail={`${followUps.filter((item) => item.priority === "Overdue" && !item.done).length} overdue`} />
      <Metric icon={TrendingUp} label="Won / Lost" value={analytics.wonLost} detail="Local demo outcome" />
    </section>

    <div className="broker-hub-layout">
      <section className="broker-hub-main">
        <div className="broker-feature-grid">
          {brokerWorkspaceFeatures.map((feature) => (
            <button key={feature.id} className={tab === feature.tab ? "active" : ""} onClick={() => setTab(feature.tab)}>
              <span>{feature.code} · {feature.priority}</span>
              <strong>{feature.title}</strong>
              <small>{feature.summary}</small>
            </button>
          ))}
        </div>

        <div className="broker-tab-bar">
          {brokerHubTabs.map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{tabIcon(item)}{item}</button>)}
        </div>

        {tab === "CRM" && <CrmPanel openFull={() => setFullWorkflow("Buyer CRM")} onReport={onReport} notify={notify} />}
        {tab === "Requirements" && <RequirementsPanel openFull={() => setFullWorkflow("Buyer CRM")} notify={notify} />}
        {tab === "AI Brief" && <AiBriefPanel openFull={() => setFullWorkflow("Buyer CRM")} onReport={onReport} notify={notify} />}
        {tab === "Shortlist" && <ShortlistPanel shortlists={shortlists} setShortlists={setShortlists} openFull={() => setFullWorkflow("Saved Searches")} onReport={onReport} notify={notify} />}
        {tab === "Matching" && <MatchingPanel matches={matches} openFull={() => setFullWorkflow("Matching")} onReport={onReport} notify={notify} />}
        {tab === "Pitch" && <PitchPanel pitch={pitch} version={pitchVersion} regenerate={() => setPitchVersion((value) => value + 1)} openFull={() => setFullWorkflow("Sales Copilot")} notify={notify} />}
        {tab === "Reports" && <ReportsPanel openFull={() => setFullWorkflow("Report Studio")} onReport={onReport} notify={notify} />}
        {tab === "Pipeline" && <PipelinePanel pipeline={pipeline} setPipeline={setPipeline} openBuyer={() => setFullWorkflow("Buyer CRM")} notify={notify} />}
        {tab === "Viewings" && <ViewingPanel viewings={viewings} setViewings={setViewings} notify={notify} />}
        {tab === "Follow-ups" && <FollowUpsPanel followUps={followUps} setFollowUps={setFollowUps} openPitch={() => setTab("Pitch")} notify={notify} />}
        {tab === "Commission" && <CommissionPanel notify={notify} />}
        {tab === "Analytics" && <AnalyticsPanel analytics={analytics} notify={notify} />}
      </section>

      <aside className="broker-action-rail">
        <div className="rail-card urgent">
          <span><Bell />Urgent follow-ups</span>
          {urgent.slice(0, 3).map((item) => <button key={item.id} onClick={() => setTab("Follow-ups")}><strong>{brokerBuyer(item.buyerId).name}</strong><small>{item.priority} · {item.reason}</small></button>)}
        </div>
        <div className="rail-card">
          <span><Target />Best match</span>
          <strong>{matches[0]?.property.title}</strong>
          <p>{matches[0]?.buyer.name} · {matches[0]?.match.score}% buyer fit · Deal {matches[0]?.match.dealScore}</p>
          <button onClick={() => setTab("Matching")}>Open matching <ArrowRight /></button>
        </div>
        <div className="rail-card">
          <span><Clipboard />Fast actions</span>
          <button onClick={() => { setTab("Reports"); onReport(); }}>Generate report</button>
          <button onClick={() => setTab("Pitch")}>Generate pitch</button>
          <button onClick={() => setTab("Pipeline")}>Update pipeline</button>
        </div>
      </aside>
    </div>
  </div>;
}

function CrmPanel({ openFull, onReport, notify }: { openFull: () => void; onReport: () => void; notify: (message: string) => void }) {
  return <PanelShell title="BRK-001 · Buyer CRM" action="Open full workflow" onAction={openFull}>
    <div className="broker-table-card">
      <div className="broker-table-head crm"><span>Buyer</span><span>Status</span><span>Brief</span><span>Next action</span><span /></div>
      {initialBuyerProfiles.map((buyer) => <div className="broker-table-row crm" key={buyer.id}>
        <span className="broker-person"><i>{initials(buyer.name)}</i><b>{buyer.name}<small>{buyer.owner} · {buyer.lastActivityAt}</small></b></span>
        <em className={`status-chip ${slug(buyer.status)}`}>{buyer.status}</em>
        <span>{buyer.persona}<small>{buyer.preferredAreas.join(", ")}</small></span>
        <span>{buyer.nextFollowUp}</span>
        <button onClick={() => { notify(`Report setup opened for ${buyer.name}`); onReport(); }}>Report</button>
      </div>)}
    </div>
  </PanelShell>;
}

function RequirementsPanel({ openFull, notify }: { openFull: () => void; notify: (message: string) => void }) {
  const buyer = initialBuyerProfiles[1];
  return <PanelShell title="BRK-002 · Buyer requirement form" action="Edit in CRM" onAction={openFull}>
    <div className="requirement-layout">
      <section>
        <h3>{buyer.name}</h3>
        <p>{buyer.persona} · {buyer.timeline}</p>
        <div className="broker-fact-grid">
          <Fact label="Budget" value={`${money(buyer.budgetMin)}–${money(buyer.budgetMax)}`} />
          <Fact label="Areas" value={buyer.preferredAreas.join(", ")} />
          <Fact label="Bedrooms" value={`${buyer.bedrooms || "Studio"} bed`} />
          <Fact label="School needs" value={buyer.schoolNeeds} />
          <Fact label="Lifestyle" value={buyer.lifestylePreferences} />
          <Fact label="Financing" value={buyer.financingStatus} />
        </div>
      </section>
      <aside>
        <Search />
        <strong>Requirement capture ready</strong>
        <p>Uses the existing buyer profile fields and remains workspace-specific.</p>
        <button className="primary-button" onClick={() => notify("Quick requirement form opened in demo mode")}>Open quick form</button>
      </aside>
    </div>
  </PanelShell>;
}

function AiBriefPanel({ openFull, onReport, notify }: { openFull: () => void; onReport: () => void; notify: (message: string) => void }) {
  const buyer = initialBuyerProfiles[0];
  const summary = generateBuyerSummary(buyer);
  return <PanelShell title="BRK-003 · AI buyer brief" action="Open buyer intelligence" onAction={openFull}>
    <div className="ai-brief-layout">
      <section className="persona-card compact">
        <span>AI PERSONA</span>
        <h3>{buyer.persona}</h3>
        <p>{buyer.personaExplanation}</p>
      </section>
      <section className="broker-summary-grid">
        <Fact label="Motivation" value={summary.motivation} />
        <Fact label="Likely objections" value={summary.likelyObjections} />
        <Fact label="Suggested areas" value={summary.suggestedAreas} />
        <Fact label="Sales angle" value={summary.salesAngle} />
      </section>
      <footer>
        <button onClick={() => { navigator.clipboard?.writeText(Object.values(summary).join("\n\n")); notify("AI buyer brief copied"); }}><Clipboard />Copy brief</button>
        <button className="primary-button" onClick={() => { notify("AI buyer brief inserted into report draft"); onReport(); }}><FileText />Insert into report</button>
      </footer>
    </div>
  </PanelShell>;
}

function ShortlistPanel({ shortlists, setShortlists, openFull, onReport, notify }: { shortlists: BrokerShortlist[]; setShortlists: (next: BrokerShortlist[]) => void; openFull: () => void; onReport: () => void; notify: (message: string) => void }) {
  function toggle(list: BrokerShortlist, propertyId: string) {
    setShortlists(shortlists.map((item) => item.id === list.id ? { ...item, propertyIds: item.propertyIds.includes(propertyId) ? item.propertyIds.filter((id) => id !== propertyId) : [...item.propertyIds, propertyId], updatedAt: "Just now" } : item));
    notify("Shortlist updated locally");
  }
  return <PanelShell title="BRK-004 · Property shortlist" action="Open saved searches" onAction={openFull}>
    <div className="shortlist-board">
      {shortlists.map((list) => <article key={list.id}>
        <header><span><Bookmark />{list.visibility}</span><h3>{list.name}</h3><p>{brokerBuyer(list.buyerId).name} · {list.updatedAt}</p></header>
        {initialProperties.slice(0, 3).map((property) => <button key={property.id} className={list.propertyIds.includes(property.id) ? "selected" : ""} onClick={() => toggle(list, property.id)}><span>{property.title}<small>{property.neighbourhood} · {money(property.price)}</small></span>{list.propertyIds.includes(property.id) ? <Check /> : <Bookmark />}</button>)}
        <footer><button onClick={onReport}>Create report</button><button onClick={openFull}>Open matches</button></footer>
      </article>)}
    </div>
  </PanelShell>;
}

function MatchingPanel({ matches, openFull, onReport, notify }: { matches: ReturnType<typeof topBrokerMatches>; openFull: () => void; onReport: () => void; notify: (message: string) => void }) {
  return <PanelShell title="BRK-005 · AI matching score" action="Open full matching" onAction={openFull}>
    <div className="broker-match-list">
      {matches.map(({ buyer, property, match }) => <article key={match.id}>
        <div className="match-score-large"><strong>{match.score}</strong><span>fit</span></div>
        <div>
          <span>{buyer.name} × {property.neighbourhood}</span>
          <h3>{property.title}</h3>
          <p>{match.reasons[0] || match.mismatches[0] || "Match explanation pending."}</p>
          <small>Deal score {match.dealScore}/100 · {match.dealLabel}</small>
        </div>
        <footer><button onClick={() => notify("Fit matrix opened in full matching workflow")}>Matrix</button><button onClick={() => notify("Property added to shortlist")}>Shortlist</button><button className="primary-button" onClick={onReport}>Report</button></footer>
      </article>)}
    </div>
  </PanelShell>;
}

function PitchPanel({ pitch, version, regenerate, openFull, notify }: { pitch: string; version: number; regenerate: () => void; openFull: () => void; notify: (message: string) => void }) {
  return <PanelShell title="BRK-006 · WhatsApp pitch generator" action="Open Sales Copilot" onAction={openFull}>
    <div className="pitch-workbench">
      <section><MessageCircle /><h3>One-click WhatsApp pitch</h3><p>Generated from selected buyer, property and tone defaults.</p><textarea readOnly value={pitch} /></section>
      <aside><strong>Version {version}</strong><button onClick={() => { navigator.clipboard?.writeText(pitch); notify("WhatsApp pitch copied"); }}><Clipboard />Copy pitch</button><button onClick={() => { regenerate(); notify("Pitch regenerated locally"); }}><RefreshCcw />Regenerate</button></aside>
    </div>
  </PanelShell>;
}

function ReportsPanel({ openFull, onReport, notify }: { openFull: () => void; onReport: () => void; notify: (message: string) => void }) {
  return <PanelShell title="BRK-007 · Buyer report generator" action="Open Report Studio" onAction={openFull}>
    <div className="report-entry-grid">
      {["Single property report", "Property comparison report", "Investor report", "Family relocation report"].map((title, index) => <article key={title}>
        <FileText /><span>{index < 2 ? "P0" : "Template"}</span><h3>{title}</h3><p>Uses buyer context, branding, sections and editable report preview.</p><button className="primary-button" onClick={() => { notify(`${title} setup opened`); onReport(); }}>Generate</button>
      </article>)}
    </div>
  </PanelShell>;
}

function PipelinePanel({ pipeline, setPipeline, openBuyer, notify }: { pipeline: BrokerPipelineDeal[]; setPipeline: (next: BrokerPipelineDeal[]) => void; openBuyer: () => void; notify: (message: string) => void }) {
  function move(deal: BrokerPipelineDeal, status: BuyerStatus) {
    setPipeline(pipeline.map((item) => item.id === deal.id ? { ...item, status, updatedAt: "Just now", probability: status === "Won" ? 100 : status === "Lost" ? 0 : Math.min(92, item.probability + 12) } : item));
    notify(`${brokerBuyer(deal.buyerId).name} moved to ${status}`);
  }
  return <PanelShell title="BRK-008 · Deal pipeline">
    <div className="pipeline-board">
      {brokerPipelineStatuses.map((status) => <section key={status}>
        <header>{status}<span>{pipeline.filter((deal) => deal.status === status).length}</span></header>
        {pipeline.filter((deal) => deal.status === status).map((deal) => <article key={deal.id}>
          <strong>{brokerBuyer(deal.buyerId).name}</strong>
          <p>{brokerProperty(deal.propertyId).title}</p>
          <span>{money(deal.value)} · {deal.probability}% probability</span>
          <small>{deal.nextAction}</small>
          <footer><button onClick={openBuyer}>Buyer</button><button onClick={() => move(deal, nextStatus(deal.status))}>Move forward</button><button onClick={() => move(deal, "Won")}>Won</button><button onClick={() => move(deal, "Lost")}>Lost</button></footer>
        </article>)}
      </section>)}
    </div>
  </PanelShell>;
}

function ViewingPanel({ viewings, setViewings, notify }: { viewings: BrokerViewing[]; setViewings: (next: BrokerViewing[]) => void; notify: (message: string) => void }) {
  function patch(viewing: BrokerViewing, patch: Partial<BrokerViewing>) {
    setViewings(viewings.map((item) => item.id === viewing.id ? { ...item, ...patch } : item));
    notify("Viewing tracker updated");
  }
  return <PanelShell title="BRK-009 · Viewing tracker">
    <div className="viewing-list">
      {viewings.map((viewing) => <article key={viewing.id}>
        <CalendarDays /><div><span>{viewing.scheduledAt}</span><h3>{brokerBuyer(viewing.buyerId).name}</h3><p>{brokerProperty(viewing.propertyId).title}</p><small>{viewing.feedback}</small></div><em>{viewing.status}</em>
        <footer><button onClick={() => patch(viewing, { status: "Confirmed", nextAction: "Viewing confirmed" })}>Confirm</button><button onClick={() => patch(viewing, { status: "Completed", feedback: "Feedback captured locally", nextAction: "Send follow-up" })}>Complete</button><button onClick={() => patch(viewing, { feedback: "Buyer asked for price and service-charge evidence." })}>Add feedback</button></footer>
      </article>)}
    </div>
  </PanelShell>;
}

function FollowUpsPanel({ followUps, setFollowUps, openPitch, notify }: { followUps: BrokerFollowUpReminder[]; setFollowUps: (next: BrokerFollowUpReminder[]) => void; openPitch: () => void; notify: (message: string) => void }) {
  function patch(reminder: BrokerFollowUpReminder, patch: Partial<BrokerFollowUpReminder>) {
    setFollowUps(followUps.map((item) => item.id === reminder.id ? { ...item, ...patch } : item));
  }
  return <PanelShell title="BRK-010 · Follow-up reminders">
    <div className="followup-reminder-grid">
      {followUps.map((item) => <article key={item.id} className={item.done ? "done" : item.priority.toLowerCase().replace(" ", "-")}>
        <span>{item.done ? "Done" : item.snoozed ? "Snoozed" : item.priority}</span>
        <h3>{brokerBuyer(item.buyerId).name}</h3>
        <p>{item.reason}</p>
        <small>{item.dueAt} · {brokerProperty(item.propertyId).neighbourhood}</small>
        <footer><button onClick={() => { patch(item, { done: true }); notify("Follow-up marked done"); }}><Check />Done</button><button onClick={() => { patch(item, { snoozed: true, dueAt: "Snoozed · tomorrow" }); notify("Follow-up snoozed"); }}><TimerReset />Snooze</button><button onClick={openPitch}><MessageCircle />Pitch</button></footer>
      </article>)}
    </div>
  </PanelShell>;
}

function CommissionPanel({ notify }: { notify: (message: string) => void }) {
  const summary = brokerCommissionSummary();
  return <PanelShell title="BRK-011 · Commission tracker">
    <div className="commission-layout">
      <section className="broker-fact-grid">
        <Fact label="Projected" value={money(summary.projected)} />
        <Fact label="Approved" value={money(summary.approved)} />
        <Fact label="Paid" value={money(summary.paid)} />
        <Fact label="Disputed" value={money(summary.disputed)} />
      </section>
      <section className="broker-table-card">
        <div className="broker-table-head commission"><span>Deal</span><span>Broker</span><span>Split</span><span>Status</span></div>
        {aurestCommissionRecords.map((record) => <div className="broker-table-row commission" key={record.deal}><span>{record.deal}<small>{record.agency}</small></span><span>{record.broker}</span><span>{record.commissionSplit}</span><em>{record.status}</em></div>)}
      </section>
      <button className="primary-button" onClick={() => notify("Commission export prepared in demo mode")}><CircleDollarSign />Export commission view</button>
    </div>
  </PanelShell>;
}

function AnalyticsPanel({ analytics, notify }: { analytics: ReturnType<typeof brokerPersonalAnalytics>; notify: (message: string) => void }) {
  return <PanelShell title="BRK-012 · Broker personal analytics">
    <div className="analytics-hub-grid">
      <Fact label="Buyers created" value={String(analytics.buyersCreated)} />
      <Fact label="Reports generated" value={String(analytics.reportsGenerated)} />
      <Fact label="Pitches copied" value={String(analytics.pitchesCopied)} />
      <Fact label="Follow-ups done" value={String(analytics.followUpsDone)} />
      <Fact label="Shortlisted properties" value={String(analytics.propertiesShortlisted)} />
      <Fact label="Won / lost" value={analytics.wonLost} />
      <section><h3>Top personas</h3>{analytics.topPersonas.map(([persona, count]) => <p key={persona}>{persona}<strong>{count}</strong></p>)}</section>
      <section><h3>Most active areas</h3>{analytics.topAreas.map(([area, count]) => <p key={area}>{area}<strong>{count}</strong></p>)}</section>
      <button className="primary-button" onClick={() => notify("Broker analytics exported in demo mode")}><BarChart3 />Export analytics</button>
    </div>
  </PanelShell>;
}

function PanelShell({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: ReactNode }) {
  return <section className="broker-panel">
    <header><div><span>BROKER HUB</span><h2>{title}</h2></div>{action && onAction && <button onClick={onAction}>{action} <ChevronRight /></button>}</header>
    {children}
  </section>;
}

function FullWorkflowShell({ name, onBack, children }: { name: BrokerFullWorkflow; onBack: () => void; children: ReactNode }) {
  return <div className="broker-full-workflow">
    <section className="broker-panel full">
      <header><div><span>FULL WORKFLOW</span><h2>{name}</h2></div><button onClick={onBack}>Back to Broker Hub <ChevronRight /></button></header>
    </section>
    {children}
  </div>;
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Users; label: string; value: string; detail: string }) {
  return <article><Icon /><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value || "Not available"}</strong></div>;
}

function tabIcon(tab: BrokerHubTab) {
  const icons: Record<BrokerHubTab, ReactNode> = {
    CRM: <Users />,
    Requirements: <Search />,
    "AI Brief": <Sparkles />,
    Shortlist: <Bookmark />,
    Matching: <Target />,
    Pitch: <MessageCircle />,
    Reports: <FileText />,
    Pipeline: <Gauge />,
    Viewings: <CalendarDays />,
    "Follow-ups": <Bell />,
    Commission: <CircleDollarSign />,
    Analytics: <BarChart3 />,
  };
  return icons[tab];
}

function nextStatus(status: BuyerStatus): BuyerStatus {
  const index = brokerPipelineStatuses.indexOf(status);
  return brokerPipelineStatuses[Math.min(index + 1, brokerPipelineStatuses.length - 1)] ?? status;
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function slug(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}
