"use client";

import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  FileText,
  Gauge,
  Handshake,
  Layers3,
  MapPin,
  MessageCircle,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  aurestBuyerWorkspace,
  aurestCommissionRecords,
  aurestDealRooms,
  aurestLayerMetrics,
  aurestNetworkProfiles,
  aurestOpportunities,
  type AurestModule,
} from "@/lib/aurest-data";

type Props = {
  notify: (message: string) => void;
};

export function AurestHomeDashboard({ notify, onOpen }: Props & { onOpen: (routeKey: string) => void }) {
  return (
    <div className="aurest-stack">
      <section className="aurest-dashboard-hero">
        <div>
          <span><Sparkles size={15} />AUREST V2 COMMAND LAYER</span>
          <h2>One platform for intelligence, broker productivity, network collaboration, and monetization.</h2>
          <p>Frontend demo shell is active. Data is fake/local, while every module is shaped so real APIs can plug in later.</p>
          <div className="button-row">
            <button className="primary-button" onClick={() => onOpen("Opportunity Feed")}>Open opportunity feed <ArrowRight size={16} /></button>
            <button className="ghost-button" onClick={() => onOpen("Community Intelligence")}>Explore intelligence</button>
          </div>
        </div>
        <div className="aurest-orbit-card">
          <strong>91</strong>
          <span>Top opportunity score</span>
          <small>Buyer + listing + market timing</small>
        </div>
      </section>

      <section className="aurest-layer-grid">
        {aurestLayerMetrics.map((metric) => (
          <article key={`${metric.layer}-${metric.metric}`} className="aurest-layer-card">
            <span>{metric.layer} Layer</span>
            <strong>{metric.value}</strong>
            <p>{metric.metric}</p>
            <em>{metric.trend}</em>
            <small>{metric.source}</small>
          </article>
        ))}
      </section>

      <div className="two-column">
        <section className="panel aurest-priority-panel">
          <div className="panel-heading">
            <div><h2>Today’s priorities</h2><p>Ranked across buyers, listings, market, and network.</p></div>
            <button onClick={() => onOpen("Opportunity Feed")}>View feed</button>
          </div>
          <div className="aurest-opportunity-list">
            {aurestOpportunities.map((item) => <OpportunityRow key={item.id} item={item} notify={notify} />)}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div><h2>Daily brief</h2><p>Simulated intelligence brief for the workspace.</p></div>
            <span className="count-pill">4 alerts</span>
          </div>
          <div className="aurest-brief-list">
            <Brief icon={TrendingUp} title="Dubai Hills demand is warming" detail="Family buyers and 3-bed searches are both up in the demo demand model." />
            <Brief icon={Gauge} title="Investor yield watch" detail="JVC and Marina remain strongest for fake gross yield estimates this week." />
            <Brief icon={Network} title="Network referral available" detail="One trusted broker has matching Palm inventory for your luxury buyer." />
            <Brief icon={Bell} title="Follow-up pressure" detail="Five buyers need action before tomorrow morning." />
          </div>
        </section>
      </div>
    </div>
  );
}

export function AurestModuleScreen({ module, notify }: Props & { module: AurestModule }) {
  const context = getModuleContext(module);
  return (
    <div className="aurest-stack">
      <section className={`aurest-module-hero ${module.sectionId}`}>
        <div>
          <span><context.Icon size={15} />{sectionLabel(module.sectionId)} · {module.status}</span>
          <h2>{module.label}</h2>
          <p>{module.description}</p>
        </div>
        <button className="primary-button" onClick={() => notify(`${module.label}: primary demo action completed`)}>{context.primaryAction} <ArrowRight size={16} /></button>
      </section>

      <section className="aurest-kpi-grid">
        {context.kpis.map((kpi) => (
          <article className="aurest-kpi-card" key={kpi.label}>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <p>{kpi.detail}</p>
          </article>
        ))}
      </section>

      {renderModuleBody(module, notify)}

      <section className="insight-strip">
        <div className="insight-icon"><Layers3 /></div>
        <div>
          <span>FRONTEND DEMO / API-READY LATER</span>
          <strong>{module.label} is wired as a local Aurest V2 module.</strong>
          <p>No backend, DLD, Google Maps, CRM, WhatsApp, billing, or payments integration was introduced in this milestone.</p>
        </div>
        <button onClick={() => notify(`${module.label} API contract placeholder noted`)}>Mark ready <ArrowRight size={16} /></button>
      </section>
    </div>
  );
}

function renderModuleBody(module: AurestModule, notify: (message: string) => void) {
  if (module.label === "Deal Rooms") {
    return <DealRooms notify={notify} />;
  }

  if (module.sectionId === "connect") {
    return (
      <div className="aurest-card-grid">
        {aurestNetworkProfiles.map((profile) => (
          <article className="aurest-network-card" key={profile.id}>
            <div><span>{profile.kind}</span><strong>{profile.trustScore}</strong></div>
            <h3>{profile.name}</h3>
            <p><MapPin size={13} />{profile.location}</p>
            <div className="aurest-tags">{profile.specialties.map((tag) => <em key={tag}>{tag}</em>)}</div>
            <button className="card-primary" onClick={() => notify(`Opening ${profile.name} collaboration profile`)}>Open profile</button>
          </article>
        ))}
      </div>
    );
  }

  if (module.sectionId === "buyer") {
    return (
      <div className="aurest-buyer-grid">
        <section className="data-card aurest-list-card">
          <div className="section-title"><div><h3>{aurestBuyerWorkspace.buyer}</h3><p>Buyer workspace state</p></div></div>
          {aurestBuyerWorkspace.requirements.map((item) => <div className="aurest-list-row" key={item}><Check size={14} /><span>{item}</span></div>)}
        </section>
        <section className="data-card aurest-list-card">
          <div className="section-title"><div><h3>Shortlist feedback</h3><p>Buyer comments and sentiment</p></div></div>
          {aurestBuyerWorkspace.shortlistFeedback.map((item) => <div className="aurest-feedback-row" key={item.property}><strong>{item.property}</strong><em>{item.sentiment}</em><p>{item.note}</p></div>)}
        </section>
        <section className="data-card aurest-list-card">
          <div className="section-title"><div><h3>Viewing journey</h3><p>Buyer-facing next steps</p></div></div>
          {aurestBuyerWorkspace.viewingJourney.map((step) => <div className="aurest-journey-row" key={step.step}><span className={step.status.toLowerCase()}>{step.status}</span><strong>{step.step}</strong><small>{step.date}</small></div>)}
        </section>
      </div>
    );
  }

  if (module.label === "Commission Tracking") {
    return (
      <section className="data-card aurest-table-card">
        <div className="aurest-table-head"><span>Deal</span><span>Broker</span><span>Agency</span><span>Split</span><span>Status</span></div>
        {aurestCommissionRecords.map((record) => (
          <div className="aurest-table-row" key={record.deal}><strong>{record.deal}</strong><span>{record.broker}</span><span>{record.agency}</span><span>{record.commissionSplit}</span><em>{record.status}</em></div>
        ))}
      </section>
    );
  }

  if (module.sectionId === "intelligence") {
    return <IntelligenceCanvas notify={notify} label={module.label} />;
  }

  if (module.sectionId === "admin") {
    return <AdminCanvas notify={notify} />;
  }

  if (module.sectionId === "agency") {
    return <AgencyCanvas notify={notify} />;
  }

  if (module.sectionId === "listings") {
    return <ListingsCanvas notify={notify} />;
  }

  if (module.sectionId === "match") {
    return <MatchCanvas notify={notify} />;
  }

  if (module.sectionId === "reports") {
    return <ReportsCanvas notify={notify} />;
  }

  return (
    <div className="aurest-card-grid">
      {aurestOpportunities.slice(0, 3).map((item) => <OpportunityCard key={item.id} item={item} notify={notify} />)}
    </div>
  );
}

function IntelligenceCanvas({ label, notify }: Props & { label: string }) {
  return (
    <div className="aurest-card-grid">
      {[
        ["Community demand", "82", "Buyer searches, saved searches, and report activity merged into one demo signal."],
        ["Building confidence", "76", "Project data, transaction comparables, and listing quality are ready for API enrichment."],
        ["POI coverage", "94%", "Schools, metro, malls, beaches, parks, airports, and business districts are represented."],
        ["Trend detection", "+11%", `${label} can be included in future reports as a report-ready intelligence section.`],
      ].map(([title, value, detail]) => (
        <article className="aurest-info-card" key={title}>
          <span><BarChart3 size={15} />Market signal</span>
          <strong>{value}</strong>
          <h3>{title}</h3>
          <p>{detail}</p>
          <button onClick={() => notify(`${title} included in report simulation`)}>Include in report</button>
        </article>
      ))}
    </div>
  );
}

function AgencyCanvas({ notify }: Props) {
  return (
    <div className="aurest-card-grid">
      {["Lead assignment queue", "Shared inventory controls", "Broker coaching list", "Agency usage snapshot"].map((title, index) => (
        <article className="aurest-info-card" key={title}>
          <span><Users size={15} />Agency operations</span>
          <strong>{index === 0 ? "12" : index === 1 ? "248" : index === 2 ? "7" : "68%"}</strong>
          <h3>{title}</h3>
          <p>Demo operational data respects the same frontend role and workspace assumptions as the V1 modules.</p>
          <button onClick={() => notify(`${title} opened`)}>Review</button>
        </article>
      ))}
    </div>
  );
}

function ListingsCanvas({ notify }: Props) {
  return (
    <div className="aurest-card-grid">
      {["Scraped portal batch", "Manual broker listing", "Developer off-plan stock", "Duplicate review queue"].map((title, index) => (
        <article className="aurest-info-card" key={title}>
          <span><Building2 size={15} />Listings data layer</span>
          <strong>{index === 0 ? "42" : index === 1 ? "9" : index === 2 ? "31" : "6"}</strong>
          <h3>{title}</h3>
          <p>Listings remain fake/local and are structured for normalization, quality scoring, freshness, and future imports.</p>
          <button onClick={() => notify(`${title} reviewed`) }>Review listings</button>
        </article>
      ))}
    </div>
  );
}

function MatchCanvas({ notify }: Props) {
  return (
    <div className="aurest-card-grid">
      {aurestOpportunities.map((item) => <OpportunityCard key={item.id} item={item} notify={notify} />)}
    </div>
  );
}

function ReportsCanvas({ notify }: Props) {
  return (
    <div className="aurest-card-grid">
      {["Buyer report", "Investment report", "Community report", "Agency branded report"].map((title) => (
        <article className="aurest-info-card" key={title}>
          <span><FileText size={15} />Report-ready</span>
          <strong>V2</strong>
          <h3>{title}</h3>
          <p>Uses the Aurest report taxonomy while preserving the existing report studio foundation.</p>
          <button onClick={() => notify(`${title} preview opened`)}>Preview</button>
        </article>
      ))}
    </div>
  );
}

function AdminCanvas({ notify }: Props) {
  return (
    <div className="aurest-card-grid">
      {["Users & roles", "Data source readiness", "Permission policies", "Billing and plan limits", "Audit log stream"].map((title) => (
        <article className="aurest-info-card" key={title}>
          <span><ShieldCheck size={15} />Admin layer</span>
          <strong>Ready</strong>
          <h3>{title}</h3>
          <p>Administrative controls are represented as frontend workflows and can later connect to real services.</p>
          <button onClick={() => notify(`${title} action simulated`)}>Open control</button>
        </article>
      ))}
    </div>
  );
}

function DealRooms({ notify }: Props) {
  return (
    <section className="data-card aurest-table-card">
      <div className="aurest-table-head"><span>Buyer</span><span>Broker</span><span>Property</span><span>Status</span><span>Next action</span></div>
      {aurestDealRooms.map((room) => (
        <button className="aurest-table-row" key={room.id} onClick={() => notify(`Opening deal room for ${room.buyer}`)}>
          <strong>{room.buyer}</strong><span>{room.broker}</span><span>{room.property}</span><em>{room.status}</em><span>{room.nextAction}</span>
        </button>
      ))}
    </section>
  );
}

function OpportunityRow({ item, notify }: { item: (typeof aurestOpportunities)[number]; notify: (message: string) => void }) {
  return (
    <article className="aurest-opportunity-row">
      <div><span>{item.type}</span><strong>{item.context}</strong><p>{item.reason}</p></div>
      <b>{item.score}</b>
      <button onClick={() => notify(`${item.action} started`)}>{item.action}</button>
    </article>
  );
}

function OpportunityCard({ item, notify }: { item: (typeof aurestOpportunities)[number]; notify: (message: string) => void }) {
  return (
    <article className="aurest-info-card">
      <span><Target size={15} />{item.type} opportunity</span>
      <strong>{item.score}</strong>
      <h3>{item.context}</h3>
      <p>{item.reason}</p>
      <button onClick={() => notify(`${item.action} started`)}>{item.action}</button>
    </article>
  );
}

function Brief({ icon: Icon, title, detail }: { icon: typeof TrendingUp; title: string; detail: string }) {
  return <div className="aurest-brief"><Icon size={17} /><div><strong>{title}</strong><p>{detail}</p></div></div>;
}

function getModuleContext(module: AurestModule) {
  const map = {
    home: { Icon: Sparkles, primaryAction: "Open priority" },
    intelligence: { Icon: BarChart3, primaryAction: "Include insight" },
    connect: { Icon: Handshake, primaryAction: "Start collaboration" },
    broker: { Icon: MessageCircle, primaryAction: "Create action" },
    agency: { Icon: Users, primaryAction: "Review team" },
    buyer: { Icon: Users, primaryAction: "Share update" },
    listings: { Icon: Building2, primaryAction: "Review inventory" },
    match: { Icon: Target, primaryAction: "Score opportunity" },
    reports: { Icon: FileText, primaryAction: "Preview report" },
    admin: { Icon: ShieldCheck, primaryAction: "Open control" },
  }[module.sectionId];

  return {
    ...map,
    kpis: [
      { label: "Records", value: module.sectionId === "connect" ? "31" : module.sectionId === "listings" ? "248" : "24", detail: "Fake local data" },
      { label: "Readiness", value: module.status === "Live V1" ? "Live" : "Demo", detail: "Frontend workflow" },
      { label: "Signal", value: module.sectionId === "intelligence" ? "+8%" : "High", detail: "API-ready later" },
      { label: "Actions", value: "4", detail: "Toast-enabled" },
    ],
  };
}

function sectionLabel(sectionId: AurestModule["sectionId"]) {
  return {
    home: "Aurest Home",
    intelligence: "Aurest Intelligence",
    connect: "Aurest Connect",
    broker: "Broker Workspace",
    agency: "Agency Workspace",
    buyer: "Buyer Workspace",
    listings: "Listings",
    match: "Match",
    reports: "Reports",
    admin: "Admin",
  }[sectionId];
}
