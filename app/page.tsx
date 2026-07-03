"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Activity,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  CircleUserRound,
  FileText,
  Handshake,
  Home,
  Layers3,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { rankProperties, type Buyer } from "@/lib/matching";
import { sampleBuyer, sampleProperties } from "@/lib/sample-data";
import { FeatureWorkspace } from "@/components/feature-workspace";
import { initialBrokerProfile, initialWorkspace, type BrokerProfile, type Workspace, workspaceTypeMeta } from "@/lib/workspace";
import { AuthScreen } from "@/components/auth-screen";
import type { AuthSession, SignupPayload } from "@/lib/auth";
import { currentUsage, planFromWorkspacePlan } from "@/lib/integrations-billing";
import { aurestSections, getAurestModule, type AurestSectionId } from "@/lib/aurest-data";
import { AurestHomeDashboard } from "@/components/aurest-v2";
import { AiAssistantDrawer, AiCommandCenter } from "@/components/ai-assistant";
import type { AiActionHistoryItem } from "@/lib/ai-command";

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const money = { format: (value: number) => `AED ${number.format(value)}` };

const sectionIcons: Record<AurestSectionId, typeof Home> = {
  home: Home,
  intelligence: BarChart3,
  connect: Handshake,
  broker: MessageCircle,
  agency: Users,
  buyer: CircleUserRound,
  listings: Building2,
  match: Target,
  reports: FileText,
  admin: ShieldCheck,
};

type Modal = "buyer" | "report" | "message" | null;

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [buyer, setBuyer] = useState<Buyer>(sampleBuyer);
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [profile, setProfile] = useState<BrokerProfile>(initialBrokerProfile);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiHistory, setAiHistory] = useState<AiActionHistoryItem[]>([]);
  const matches = useMemo(() => rankProperties(buyer, sampleProperties), [buyer]);
  const bestMatch = matches[0];
  const activePlan = useMemo(() => planFromWorkspacePlan(workspace.plan), [workspace.plan]);
  const reportsLeft = Math.max(0, activePlan.limits.reports - currentUsage.reports);
  const activeModule = getAurestModule(active);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function completeSignup(nextSession: AuthSession, payload: SignupPayload) {
    setWorkspace({ ...initialWorkspace, id: nextSession.user.workspaceId, name: payload.workspaceName, type: payload.workspaceType, plan: payload.workspaceType === "solo" ? "Solo" : payload.workspaceType === "team" ? "Team" : "Agency", brandingLocked: payload.workspaceType === "agency", contactEmail: payload.email, logoText: payload.workspaceName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "WS" });
    setProfile({ ...initialBrokerProfile, fullName: payload.name, email: payload.email, companyName: payload.workspaceName });
    setSession(nextSession);
  }

  if (!session) return <AuthScreen onLogin={setSession} onSignup={completeSignup} />;

  return (
    <main className="app-shell">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark"><Home size={19} strokeWidth={2.5} /></div>
          <div>
            <strong>Aurest</strong>
            <span>Platform</span>
          </div>
          <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button>
        </div>

        <button className="workspace-switcher" onClick={() => { setActive("Workspace"); setMenuOpen(false); }}>
          <div className="avatar">{workspace.logoText}</div>
          <div><span>{workspaceTypeMeta[workspace.type].label}</span><strong>{workspace.name}</strong></div>
          <ChevronDown size={16} />
        </button>

        <nav>
          {aurestSections.map((section) => {
            const Icon = sectionIcons[section.id];
            return (
              <div className="nav-section-block" key={section.id}>
                <p className="nav-label"><Icon size={12} />{section.label}</p>
                {section.modules.map((module) => (
                  <button
                    key={module.id}
                    className={active === module.routeKey ? "nav-item active" : "nav-item"}
                    onClick={() => { setActive(module.routeKey); setMenuOpen(false); }}
                    title={module.description}
                  >
                    <Layers3 size={17} />{module.label}
                    {module.status === "Live V1" && <span className="nav-count">V1</span>}
                  </button>
                ))}
              </div>
            );
          })}
          <p className="nav-label lower"><Settings size={12} />System</p>
          <button className={active === "Workspace" ? "nav-item active" : "nav-item"} onClick={() => { setActive("Workspace"); setMenuOpen(false); }}><Building2 size={19} />Workspace</button>
          <button className={active === "Security" ? "nav-item active" : "nav-item"} onClick={() => { setActive("Security"); setMenuOpen(false); }}><ShieldCheck size={19} />Security</button>
          <button className={active === "Activity" ? "nav-item active" : "nav-item"} onClick={() => { setActive("Activity"); setMenuOpen(false); }}><Activity size={19} />Activity</button>
          <button className={active === "AI Assistant" ? "nav-item active" : "nav-item"} onClick={() => { setActive("AI Assistant"); setMenuOpen(false); }}><BotIcon />AI Assistant</button>
          <button className={active === "AI content" ? "nav-item active" : "nav-item"} onClick={() => { setActive("AI content"); setMenuOpen(false); }}><Sparkles size={19} />Prompt library</button>
          <button className={active === "Settings" ? "nav-item active" : "nav-item"} onClick={() => { setActive("Settings"); setMenuOpen(false); }}><Settings size={19} />Settings</button>
        </nav>

        <div className="plan-card">
          <span className="plan-badge">{activePlan.name.toUpperCase()}</span>
          <strong>{currentUsage.reports} of {activePlan.limits.reports} reports</strong>
          <div className="plan-progress"><i style={{ width: `${Math.min(100, currentUsage.reports / activePlan.limits.reports * 100)}%` }} /></div>
          <p>{reportsLeft} reports remaining this month</p>
          <button onClick={() => setActive("Billing")}>View plan</button>
        </div>

        <button className="profile-strip" onClick={() => { setActive("Security"); setMenuOpen(false); }}>
          <div className="avatar muted"><CircleUserRound size={21} /></div>
          <div><strong>{profile.fullName}</strong><span>{workspaceTypeMeta[workspace.type].label}</span></div>
          <ChevronDown size={15} />
        </button>
      </aside>

      {menuOpen && <button className="backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}

      <section className="content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu /></button>
          <div className="search"><Search size={18} /><input aria-label="Search" placeholder="Search Aurest modules, buyers, listings, reports…" /><kbd>⌘ K</kbd></div>
          <button className="quick-action" onClick={() => setModal("buyer")}><Plus size={18} />New opportunity</button>
        </header>

        <div className="page">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Tuesday, 24 June</p>
              <h1>{active === "Dashboard" ? `Good morning, ${profile.fullName.split(" ")[0]}.` : active}</h1>
              <p>{active === "Dashboard" ? "Aurest is ready: intelligence, productivity, network, and monetization in one shell." : activeModule?.description ?? `Your ${active.toLowerCase()} workspace is ready.`}</p>
            </div>
            <div className="button-row">
              <button className="secondary-button" onClick={() => notify("Sample JSON inventory is ready to review")}><Building2 size={18} />Import properties</button>
              <button className="secondary-button" onClick={() => setAiOpen(true)}><Sparkles size={18} />Ask Aurest</button>
            </div>
          </div>

          {active === "Dashboard" ? (
            <>
              <AurestHomeDashboard notify={notify} onOpen={setActive} />
            </>
          ) : active === "AI Assistant" ? (
            <AiCommandCenter workspace={workspace} profile={profile} activeModule={active} onNavigate={setActive} notify={notify} history={aiHistory} onHistoryChange={setAiHistory} />
          ) : (
            <FeatureWorkspace active={active} buyer={buyer} matches={matches} onBuyer={() => setModal("buyer")} onReport={() => setModal("report")} notify={notify} workspace={workspace} profile={profile} onWorkspaceChange={setWorkspace} onProfileChange={setProfile} session={session} onLogout={() => { setSession(null); setActive("Overview"); }} />
          )}
        </div>
      </section>

      {modal === "buyer" && <BuyerModal buyer={buyer} onClose={() => setModal(null)} onSave={(next) => { setBuyer(next); setModal(null); notify("Buyer profile saved and matches refreshed"); }} />}
      {modal === "report" && <ReportModal buyer={buyer} match={bestMatch} workspace={workspace} profile={profile} onClose={() => setModal(null)} onMessage={() => setModal("message")} onNotify={notify} />}
      {modal === "message" && <MessageModal buyer={buyer} property={bestMatch} onClose={() => setModal(null)} onNotify={notify} />}
      <AiAssistantDrawer workspace={workspace} profile={profile} activeModule={active} open={aiOpen} onOpenChange={setAiOpen} onNavigate={(module) => { setActive(module); setAiOpen(false); }} notify={notify} history={aiHistory} onHistoryChange={setAiHistory} />
      {toast && <div className="toast"><Check size={17} />{toast}</div>}
    </main>
  );
}

function BotIcon() {
  return <Sparkles size={19} />;
}

function BuyerModal({ buyer, onClose, onSave }: { buyer: Buyer; onClose: () => void; onSave: (buyer: Buyer) => void }) {
  const [draft, setDraft] = useState(buyer);
  return (
    <ModalShell title="Create buyer profile" subtitle="Capture enough context to make the recommendation useful." onClose={onClose}>
      <form onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
        <div className="form-grid">
          <label className="span-two">Buyer name<input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
          <label>Budget from<input type="number" value={draft.budgetMin} onChange={(e) => setDraft({ ...draft, budgetMin: Number(e.target.value) })} /></label>
          <label>Budget to<input type="number" value={draft.budgetMax} onChange={(e) => setDraft({ ...draft, budgetMax: Number(e.target.value) })} /></label>
          <label>Bedrooms<select value={draft.bedrooms} onChange={(e) => setDraft({ ...draft, bedrooms: Number(e.target.value) })}><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4+ bedrooms</option></select></label>
          <label>Purpose<select value={draft.purpose} onChange={(e) => setDraft({ ...draft, purpose: e.target.value as "Buy" | "Rent" })}><option>Buy</option><option>Rent</option></select></label>
          <label className="span-two">Preferred areas<input value={draft.areas.join(", ")} onChange={(e) => setDraft({ ...draft, areas: e.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label>
          <label className="span-two">Primary objective<textarea value={draft.objective} onChange={(e) => setDraft({ ...draft, objective: e.target.value })} /></label>
        </div>
        <div className="consent"><Check size={16} /><p>Buyer details will be used only to prepare relevant property recommendations. You confirm you have a lawful basis to store this information.</p></div>
        <div className="modal-actions"><button type="button" className="ghost-button" onClick={onClose}>Cancel</button><button className="primary-button">Save & find matches <ArrowRight size={17} /></button></div>
      </form>
    </ModalShell>
  );
}

function ReportModal({ buyer, match, workspace, profile, onClose, onMessage, onNotify }: { buyer: Buyer; match: ReturnType<typeof rankProperties>[number]; workspace: Workspace; profile: BrokerProfile; onClose: () => void; onMessage: () => void; onNotify: (message: string) => void }) {
  return (
    <ModalShell title="Recommendation preview" subtitle="A concise, buyer-specific view before generating the full report." onClose={onClose} wide>
      <div className="report-preview">
        <div className="report-image" style={{ backgroundImage: `linear-gradient(0deg, rgba(8,28,30,.48), transparent), url(${match.image})` }}><span>{match.score}% BUYER MATCH</span><h3>{match.title}</h3><p>{match.area}</p></div>
        <div className="report-body">
          <div className="report-meta"><div><span>Price</span><strong>{money.format(match.price)}</strong></div><div><span>Size</span><strong>{number.format(match.size)} sq ft</strong></div><div><span>Est. yield</span><strong>{match.yield}%</strong></div></div>
          <h4>Why this works for {buyer.name.split(" ")[0]}</h4>
          <ul>{match.reasons.map((reason) => <li key={reason}><Check size={16} />{reason}</li>)}</ul>
          <div className="recommendation"><Sparkles size={18} /><p><strong>Broker recommendation</strong>This is the strongest current option because it balances the target location with a healthy yield and stays comfortably within budget.</p></div>
          <div className="report-broker-signature"><div style={{ background: workspace.primaryColor }}>{workspace.logoText}</div><p><strong>{profile.brandingPriority === "personal" ? profile.fullName : workspace.name}</strong><span>{profile.brandingPriority === "personal" ? `${workspace.name} · RERA ${profile.reraNumber}` : `${profile.fullName} · RERA ${profile.reraNumber}`}</span><em>{profile.phone} · {profile.email}</em></p></div>
          <small>{workspace.disclaimer}</small>
        </div>
      </div>
      <div className="modal-actions split"><button className="ghost-button" onClick={onMessage}><MessageCircle size={17} />Create WhatsApp pitch</button><button className="primary-button" onClick={() => onNotify("Branded report prepared for export")}><FileText size={17} />Generate branded report</button></div>
    </ModalShell>
  );
}

function MessageModal({ buyer, property, onClose, onNotify }: { buyer: Buyer; property: ReturnType<typeof rankProperties>[number]; onClose: () => void; onNotify: (message: string) => void }) {
  const message = `Hi ${buyer.name.split(" ")[0]}, I found a strong option in ${property.area} that fits what we discussed. It’s a ${property.bedrooms}-bedroom residence at ${money.format(property.price)}, with an estimated ${property.yield}% gross yield. The location and budget fit make it worth a closer look. Would you like me to send the full analysis or arrange a viewing?`;
  return (
    <ModalShell title="WhatsApp-ready pitch" subtitle="Natural, specific, and grounded in the buyer’s priorities." onClose={onClose}>
      <div className="message-box"><MessageCircle size={21} /><p>{message}</p></div>
      <div className="tone-row"><span>Tone</span><button className="selected">Advisory</button><button>Shorter</button><button>Investor</button></div>
      <div className="modal-actions"><button className="ghost-button" onClick={onClose}>Back</button><button className="primary-button" onClick={() => { navigator.clipboard?.writeText(message); onNotify("WhatsApp pitch copied"); }}><Check size={17} />Copy message</button></div>
    </ModalShell>
  );
}

function ModalShell({ title, subtitle, onClose, wide = false, children }: { title: string; subtitle: string; onClose: () => void; wide?: boolean; children: React.ReactNode }) {
  return <div className="modal-layer" role="dialog" aria-modal="true"><button className="modal-backdrop" onClick={onClose} aria-label="Close" /><div className={wide ? "modal wide" : "modal"}><div className="modal-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button onClick={onClose} aria-label="Close"><X size={20} /></button></div>{children}</div></div>;
}
