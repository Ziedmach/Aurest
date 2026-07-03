"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  Copy,
  DoorOpen,
  Eye,
  Handshake,
  HelpCircle,
  LockKeyhole,
  MessageCircle,
  Plus,
  Reply,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { UiModal } from "@/components/ui-modal";
import {
  advisoryCouncilItems,
  calculateBrokerTrustScore,
  connectEvents,
  filterBrokerDirectory,
  getBrokerRankings,
  routeToConnectTab,
  verificationSteps,
  type BrokerVerificationStep,
  type ConnectAgencyProfile,
  type ConnectBrokerProfile,
  type ConnectDealRoom,
  type ConnectEvent,
  type ConnectTab,
  type CommunityDiscussionThread,
  type PrivateBrokerRequest,
  type ReferralRecord,
  type SharedDeal,
  connectAgencies,
  connectBrokers,
  connectDealRooms,
  discussionThreads,
  privateBrokerRequests,
  referralRecords,
  sharedDeals,
} from "@/lib/connect-data";

type Props = {
  active: string;
  notify: (message: string) => void;
};

const tabs: { tab: ConnectTab; label: string; icon: typeof Users }[] = [
  { tab: "Directory", label: "Directory", icon: Users },
  { tab: "Profiles", label: "Profiles", icon: Building2 },
  { tab: "Verification", label: "Verification", icon: ShieldCheck },
  { tab: "Private Requests", label: "Private requests", icon: LockKeyhole },
  { tab: "Deal Sharing", label: "Deal sharing", icon: Handshake },
  { tab: "Deal Rooms", label: "Deal rooms", icon: DoorOpen },
  { tab: "Referrals", label: "Referrals", icon: ChevronRight },
  { tab: "Advisory Council", label: "Advisory", icon: HelpCircle },
  { tab: "Trust & Rankings", label: "Trust", icon: Award },
  { tab: "Discussions", label: "Discussions", icon: MessageCircle },
  { tab: "Events", label: "Events", icon: CalendarDays },
];

const areas = ["All areas", ...Array.from(new Set(connectBrokers.flatMap((broker) => broker.areasServed)))];
const specialties = ["All specialties", ...Array.from(new Set(connectBrokers.flatMap((broker) => broker.specialties)))];
const languages = ["All languages", ...Array.from(new Set(connectBrokers.flatMap((broker) => broker.languages)))];
const badges = ["All badges", "Founding Broker", "Verified Broker", "Advisory Member", "New Member"];
const agencies = ["All agencies", ...Array.from(new Set(connectBrokers.map((broker) => broker.company)))];

export function AurestConnect({ active, notify }: Props) {
  const [tab, setTab] = useState<ConnectTab>(() => routeToConnectTab(active));
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All areas");
  const [specialty, setSpecialty] = useState("All specialties");
  const [language, setLanguage] = useState("All languages");
  const [badge, setBadge] = useState("All badges");
  const [agency, setAgency] = useState("All agencies");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"Trust score" | "Active deals" | "Newest" | "Response rate">("Trust score");
  const [selectedBroker, setSelectedBroker] = useState<ConnectBrokerProfile | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<ConnectAgencyProfile | null>(null);
  const [steps, setSteps] = useState(verificationSteps);
  const [requests, setRequests] = useState(privateBrokerRequests);
  const [deals, setDeals] = useState(sharedDeals);
  const [rooms, setRooms] = useState(connectDealRooms);
  const [referrals, setReferrals] = useState(referralRecords);
  const [threads, setThreads] = useState(discussionThreads);
  const [events, setEvents] = useState(connectEvents);

  const filteredBrokers = useMemo(() => filterBrokerDirectory({ query, area, specialty, language, badge, agency, verifiedOnly, sortBy }), [query, area, specialty, language, badge, agency, verifiedOnly, sortBy]);
  const heroBroker = filteredBrokers[0] ?? connectBrokers[0];

  function demo(message: string) {
    notify(`${message} · frontend demo only`);
  }

  function submitVerification() {
    setSteps((current) => current.map((step, index) => index <= 2 ? { ...step, status: index < 2 ? "Done" : "In review" } : step));
    demo("Verification submitted for admin review");
  }

  function approveVerification() {
    setSteps((current) => current.map((step) => ({ ...step, status: "Done" })));
    demo("Broker marked verified locally");
  }

  function addRequest() {
    const next: PrivateBrokerRequest = {
      id: `req_${Date.now()}`,
      type: "Buyer need",
      title: "Need verified Downtown 2BR below benchmark",
      requester: "Zied Machkena",
      area: "Downtown Dubai",
      budget: "AED 2.1M–2.6M",
      confidentiality: "Open to verified brokers",
      status: "Open",
      responses: 0,
      expires: "7 days",
    };
    setRequests((current) => [next, ...current]);
    demo("Private broker request created");
  }

  function createThread() {
    const next: CommunityDiscussionThread = {
      id: `thread_${Date.now()}`,
      community: "Business Bay",
      type: "Question",
      title: "Are buyers asking more about service charges this week?",
      author: "Zied Machkena",
      replies: 0,
      useful: 0,
      followed: true,
      lastActivity: "Now",
    };
    setThreads((current) => [next, ...current]);
    demo("Discussion thread created");
  }

  return <div className="connect-hub">
    <section className="connect-hero">
      <div>
        <span><Handshake size={15} /> AUREST CONNECT V2</span>
        <h2>Broker network, trust, referrals, and deal collaboration in one cockpit.</h2>
        <p>All Connect workflows are simulated with local fake data: verification, private requests, shared deals, referrals, discussions, and events are API-ready later without adding a backend now.</p>
        <div className="connect-hero-actions">
          <button onClick={() => setTab("Directory")}>Find broker</button>
          <button onClick={() => setTab("Private Requests")}>Post request</button>
          <button onClick={() => setTab("Deal Sharing")}>Share deal</button>
        </div>
      </div>
      <aside>
        <strong>{heroBroker.trustScore}</strong>
        <span>top trust score</span>
        <small>{heroBroker.name} · {heroBroker.badge}</small>
      </aside>
    </section>

    <div className="connect-kpis">
      <Kpi icon={Users} label="Verified brokers" value={String(connectBrokers.filter((broker) => broker.verified).length)} detail="network profiles" />
      <Kpi icon={Building2} label="Agency partners" value={String(connectAgencies.length)} detail="shared collaboration" />
      <Kpi icon={LockKeyhole} label="Private requests" value={String(requests.filter((request) => request.status !== "Closed").length)} detail="open/matched" />
      <Kpi icon={DoorOpen} label="Deal rooms" value={String(rooms.length)} detail="active rooms" />
      <Kpi icon={Star} label="Avg trust" value={`${Math.round(connectBrokers.reduce((sum, broker) => sum + broker.trustScore, 0) / connectBrokers.length)}`} detail="demo score" />
    </div>

    <div className="connect-tabs">
      {tabs.map(({ tab: item, label, icon: Icon }) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}><Icon size={14} />{label}</button>)}
    </div>

    {tab === "Directory" && <DirectoryTab brokers={filteredBrokers} query={query} area={area} specialty={specialty} language={language} badge={badge} agency={agency} verifiedOnly={verifiedOnly} sortBy={sortBy} setQuery={setQuery} setArea={setArea} setSpecialty={setSpecialty} setLanguage={setLanguage} setBadge={setBadge} setAgency={setAgency} setVerifiedOnly={setVerifiedOnly} setSortBy={setSortBy} onBroker={setSelectedBroker} notify={demo} />}
    {tab === "Profiles" && <ProfilesTab onBroker={setSelectedBroker} onAgency={setSelectedAgency} notify={demo} />}
    {tab === "Verification" && <VerificationTab steps={steps} onSubmit={submitVerification} onApprove={approveVerification} notify={demo} />}
    {tab === "Private Requests" && <PrivateRequestsTab requests={requests} onAdd={addRequest} onRespond={(id) => { setRequests((current) => current.map((item) => item.id === id ? { ...item, status: "Responded", responses: item.responses + 1 } : item)); demo("Response attached to private request"); }} />}
    {tab === "Deal Sharing" && <DealSharingTab deals={deals} onRequest={(id) => { setDeals((current) => current.map((item) => item.id === id ? { ...item, status: "Access requested" } : item)); demo("Access requested"); }} onRoom={(deal) => { setDeals((current) => current.map((item) => item.id === deal.id ? { ...item, status: "Room opened" } : item)); demo("Deal converted into room"); }} notify={demo} />}
    {tab === "Deal Rooms" && <DealRoomsTab rooms={rooms} onStatus={(id, status) => { setRooms((current) => current.map((room) => room.id === id ? { ...room, status, timeline: [`Status moved to ${status}`, ...room.timeline] } : room)); demo(`Deal room moved to ${status}`); }} onNote={(id) => { setRooms((current) => current.map((room) => room.id === id ? { ...room, notes: ["Local demo note added by broker.", ...room.notes] } : room)); demo("Deal room note added"); }} />}
    {tab === "Referrals" && <ReferralsTab referrals={referrals} onAdvance={(id) => { setReferrals((current) => current.map((referral) => referral.id === id ? { ...referral, status: nextReferralStatus(referral.status), lastUpdate: "Now" } : referral)); demo("Referral status updated"); }} />}
    {tab === "Advisory Council" && <AdvisoryTab notify={demo} />}
    {tab === "Trust & Rankings" && <TrustTab brokers={filteredBrokers.length ? filteredBrokers : connectBrokers} onBroker={setSelectedBroker} notify={demo} />}
    {tab === "Discussions" && <DiscussionsTab threads={threads} onCreate={createThread} onFollow={(id) => { setThreads((current) => current.map((thread) => thread.id === id ? { ...thread, followed: !thread.followed } : thread)); demo("Thread follow state updated"); }} onUseful={(id) => { setThreads((current) => current.map((thread) => thread.id === id ? { ...thread, useful: thread.useful + 1 } : thread)); demo("Marked useful"); }} onReply={(id) => { setThreads((current) => current.map((thread) => thread.id === id ? { ...thread, replies: thread.replies + 1, lastActivity: "Now" } : thread)); demo("Reply added"); }} />}
    {tab === "Events" && <EventsTab events={events} onRsvp={(id) => { setEvents((current) => current.map((event) => event.id === id ? { ...event, rsvp: event.rsvp === "Going" ? "Not RSVP’d" : "Going" } : event)); demo("RSVP updated"); }} />}

    {selectedBroker && <BrokerProfileModal broker={selectedBroker} onClose={() => setSelectedBroker(null)} notify={demo} />}
    {selectedAgency && <AgencyProfileModal agency={selectedAgency} onClose={() => setSelectedAgency(null)} notify={demo} />}
  </div>;
}

function Kpi({ icon: Icon, label, value, detail }: { icon: typeof Users; label: string; value: string; detail: string }) {
  return <article><Icon size={18} /><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}

function DirectoryTab({ brokers, query, area, specialty, language, badge, agency, verifiedOnly, sortBy, setQuery, setArea, setSpecialty, setLanguage, setBadge, setAgency, setVerifiedOnly, setSortBy, onBroker, notify }: {
  brokers: ConnectBrokerProfile[];
  query: string;
  area: string;
  specialty: string;
  language: string;
  badge: string;
  agency: string;
  verifiedOnly: boolean;
  sortBy: "Trust score" | "Active deals" | "Newest" | "Response rate";
  setQuery: (value: string) => void;
  setArea: (value: string) => void;
  setSpecialty: (value: string) => void;
  setLanguage: (value: string) => void;
  setBadge: (value: string) => void;
  setAgency: (value: string) => void;
  setVerifiedOnly: (value: boolean) => void;
  setSortBy: (value: "Trust score" | "Active deals" | "Newest" | "Response rate") => void;
  onBroker: (broker: ConnectBrokerProfile) => void;
  notify: (message: string) => void;
}) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-001 · CON-005" title="Broker directory" detail="Search verified brokers by area, specialty, language, badge, agency, and trust score." action="Request intro" onAction={() => notify("Intro request prepared")} />
    <div className="connect-filter-bar">
      <label className="connect-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search broker, area, specialty…" /></label>
      <Select value={area} onChange={setArea} options={areas} />
      <Select value={specialty} onChange={setSpecialty} options={specialties} />
      <Select value={language} onChange={setLanguage} options={languages} />
      <Select value={badge} onChange={setBadge} options={badges} />
      <Select value={agency} onChange={setAgency} options={agencies} />
      <label className="connect-checkbox"><input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} />Verified only</label>
      <Select value={sortBy} onChange={(value) => setSortBy(value as typeof sortBy)} options={["Trust score", "Active deals", "Newest", "Response rate"]} />
    </div>
    <div className="connect-card-grid">
      {brokers.map((broker) => <BrokerCard key={broker.id} broker={broker} onOpen={() => onBroker(broker)} onRequest={() => notify(`Private request drafted for ${broker.name}`)} />)}
    </div>
  </section>;
}

function ProfilesTab({ onBroker, onAgency, notify }: { onBroker: (broker: ConnectBrokerProfile) => void; onAgency: (agency: ConnectAgencyProfile) => void; notify: (message: string) => void }) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-002 · CON-003" title="Broker, agency, and founding profiles" detail="Agency profiles, founding badges, and broker profile cards with collaboration context." action="Apply for badge" onAction={() => notify("Founding Broker application opened")} />
    <div className="connect-program-card">
      <div><span><Award size={15} />Founding Broker Program</span><h3>Launch cohort status: reviewing 24 applications</h3><p>Criteria: verified profile, strong collaboration history, clean dispute record, response rate above 85%, and willingness to share market insight with the network.</p></div>
      <ul><li>Founding badge on profile</li><li>Early deal-room access</li><li>Advisory workshop priority</li></ul>
    </div>
    <div className="connect-two-columns">
      <div className="connect-mini-list">
        <h3>Agency profiles</h3>
        {connectAgencies.map((agency) => <AgencyRow key={agency.id} agency={agency} onOpen={() => onAgency(agency)} />)}
      </div>
      <div className="connect-mini-list">
        <h3>Featured brokers</h3>
        {connectBrokers.slice(0, 3).map((broker) => <button className="connect-person-row" key={broker.id} onClick={() => onBroker(broker)}><Avatar label={broker.avatar} /><span><strong>{broker.name}</strong><small>{broker.company} · {broker.badge}</small></span><b>{broker.trustScore}</b></button>)}
      </div>
    </div>
  </section>;
}

function VerificationTab({ steps, onSubmit, onApprove, notify }: { steps: BrokerVerificationStep[]; onSubmit: () => void; onApprove: () => void; notify: (message: string) => void }) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-004" title="Broker verification workflow" detail="Simulated verification steps for profile quality, RERA reference, agency status, identity, and admin approval." action="Submit review" onAction={onSubmit} />
    <div className="verification-layout">
      <article className="verification-summary">
        <ShieldCheck size={28} />
        <span>Current status</span>
        <strong>{steps.every((step) => step.status === "Done") ? "Verified" : steps.some((step) => step.status === "In review") ? "In review" : "Not started"}</strong>
        <p>No real identity checks are performed in this frontend milestone. This is the workflow shell for future verification providers.</p>
        <button onClick={onApprove}><BadgeCheck size={14} />Approve locally</button>
      </article>
      <div className="verification-steps">
        {steps.map((step) => <div key={step.id} className={`verification-step ${slug(step.status)}`}><i>{step.status === "Done" ? <Check size={14} /> : <ClipboardCheck size={14} />}</i><span><strong>{step.label}</strong><small>{step.detail}</small></span><em>{step.status}</em></div>)}
      </div>
    </div>
    <button className="connect-inline-action" onClick={() => notify("RERA upload placeholder opened")}>Upload RERA placeholder</button>
  </section>;
}

function PrivateRequestsTab({ requests, onAdd, onRespond }: { requests: PrivateBrokerRequest[]; onAdd: () => void; onRespond: (id: string) => void }) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-006" title="Private broker requests" detail="Request board for private inventory, buyer needs, referrals, valuation opinions, and viewing support." action="Create request" onAction={onAdd} />
    <div className="connect-card-grid three">
      {requests.map((request) => <article className="connect-request-card" key={request.id}>
        <div><span>{request.type}</span><em>{request.status}</em></div>
        <h3>{request.title}</h3>
        <p>{request.requester} · {request.area} · {request.budget}</p>
        <div className="connect-meta-row"><small>{request.confidentiality}</small><small>{request.responses} responses</small><small>Expires {request.expires}</small></div>
        <button onClick={() => onRespond(request.id)}><Reply size={14} />Respond locally</button>
      </article>)}
    </div>
  </section>;
}

function DealSharingTab({ deals, onRequest, onRoom, notify }: { deals: SharedDeal[]; onRequest: (id: string) => void; onRoom: (deal: SharedDeal) => void; notify: (message: string) => void }) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-007" title="Deal sharing" detail="Confidential deal cards with buyer needs, commission terms, access controls, and room conversion." action="Share deal" onAction={() => notify("Share deal form opened")} />
    <div className="connect-card-grid three">
      {deals.map((deal) => <article className="shared-deal-card" key={deal.id}>
        <div><span>{deal.confidentiality}</span><em>{deal.status}</em></div>
        <h3>{deal.property}</h3>
        <p>{deal.buyerNeed}</p>
        <InfoLine label="Area" value={deal.area} />
        <InfoLine label="Terms" value={deal.commissionTerms} />
        <InfoLine label="Allowed" value={deal.allowedParticipants.join(", ")} />
        <div className="connect-card-actions">
          <button onClick={() => onRequest(deal.id)}>Request access</button>
          <button onClick={() => notify("Deal summary copied")}><Copy size={13} />Copy</button>
          <button onClick={() => onRoom(deal)}>Open room</button>
        </div>
      </article>)}
    </div>
  </section>;
}

function DealRoomsTab({ rooms, onStatus, onNote }: { rooms: ConnectDealRoom[]; onStatus: (id: string, status: ConnectDealRoom["status"]) => void; onNote: (id: string) => void }) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-008" title="Deal rooms" detail="Buyer, broker, property, documents, checklist, notes, next actions, and local timeline." action="New room" onAction={() => undefined} />
    <div className="connect-room-grid">
      {rooms.map((room) => <article className="connect-room-card" key={room.id}>
        <div className="connect-room-head"><span>{room.status}</span><strong>{room.property}</strong></div>
        <p>{room.buyer} · Lead: {room.leadBroker}</p>
        <div className="connect-tags">{room.participants.map((item) => <em key={item}>{item}</em>)}</div>
        <div className="connect-checklist">{room.checklist.map((item) => <div key={item.item}><i className={item.done ? "done" : ""}>{item.done ? <Check size={12} /> : ""}</i><span>{item.item}</span></div>)}</div>
        <InfoLine label="Documents" value={room.documents.join(", ")} />
        <InfoLine label="Next action" value={room.nextAction} />
        <div className="connect-room-timeline">{room.timeline.slice(0, 3).map((item) => <small key={item}>{item}</small>)}</div>
        <div className="connect-card-actions">
          <button onClick={() => onStatus(room.id, nextRoomStatus(room.status))}>Move status</button>
          <button onClick={() => onNote(room.id)}>Add note</button>
        </div>
      </article>)}
    </div>
  </section>;
}

function ReferralsTab({ referrals, onAdvance }: { referrals: ReferralRecord[]; onAdvance: (id: string) => void }) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-009" title="Referral tracking" detail="Track source broker, receiving broker, context, fee, status, updates, and next action." action="New referral" onAction={() => undefined} />
    <div className="connect-table">
      <div className="connect-table-head"><span>Context</span><span>Brokers</span><span>Fee</span><span>Status</span><span>Next action</span><span /></div>
      {referrals.map((referral) => <div className="connect-table-row" key={referral.id}>
        <span><strong>{referral.context}</strong><small>{referral.lastUpdate}</small></span>
        <span>{referral.sourceBroker} → {referral.receivingBroker}</span>
        <span>{referral.referralFee}</span>
        <span><em>{referral.status}</em></span>
        <span>{referral.nextAction}</span>
        <button onClick={() => onAdvance(referral.id)}>Advance</button>
      </div>)}
    </div>
  </section>;
}

function AdvisoryTab({ notify }: { notify: (message: string) => void }) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-010" title="Advisory Council workspace" detail="Advisor profiles, open questions, market notes, workshop topics, and expert response placeholders." action="Ask council" onAction={() => notify("Council question drafted")} />
    <div className="connect-card-grid three">
      {advisoryCouncilItems.map((item) => <article className="connect-advisory-card" key={item.id}>
        <div><span>{item.specialty}</span><em>{item.responseStatus}</em></div>
        <h3>{item.advisor}</h3>
        <InfoLine label="Open question" value={item.openQuestion} />
        <InfoLine label="Market note" value={item.marketNote} />
        <InfoLine label="Workshop" value={item.workshopTopic} />
        <button onClick={() => notify(`Expert response requested from ${item.advisor}`)}>Request response</button>
      </article>)}
    </div>
  </section>;
}

function TrustTab({ brokers, onBroker, notify }: { brokers: ConnectBrokerProfile[]; onBroker: (broker: ConnectBrokerProfile) => void; notify: (message: string) => void }) {
  const selected = brokers[0] ?? connectBrokers[0];
  const trust = calculateBrokerTrustScore(selected);
  const rankings = getBrokerRankings("All Dubai");
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-011 · CON-012" title="Trust score and broker ranking" detail="Explainable trust scoring plus a demo-only ranking board. Rankings are internal until verified." action="Export trust pack" onAction={() => notify("Trust pack exported")} />
    <div className="trust-layout">
      <article className="trust-score-card">
        <span>Trust score</span>
        <strong>{trust.score}</strong>
        <p>{selected.name} · {selected.badge}</p>
        <button onClick={() => onBroker(selected)}><Eye size={14} />View profile</button>
      </article>
      <div className="trust-factor-list">
        {trust.factors.map((factor) => <div className="trust-factor" key={factor.label}><span><strong>{factor.label}</strong><small>{factor.explanation}</small></span><b>{factor.score}</b></div>)}
      </div>
      <div className="ranking-list">
        <h3>Broker ranking · demo-only</h3>
        {rankings.map((entry) => <button key={entry.id} onClick={() => notify(`${entry.broker} ranking opened`)}><i>#{entry.rank}</i><span><strong>{entry.broker}</strong><small>{entry.community} · {entry.specialty}</small></span><b>{entry.score}</b></button>)}
      </div>
    </div>
    <div className="connect-recommendations">{trust.improvements.map((item) => <p key={item}><Sparkles size={13} />{item}</p>)}</div>
  </section>;
}

function DiscussionsTab({ threads, onCreate, onFollow, onUseful, onReply }: { threads: CommunityDiscussionThread[]; onCreate: () => void; onFollow: (id: string) => void; onUseful: (id: string) => void; onReply: (id: string) => void }) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-013" title="Community discussion threads" detail="Market updates, buyer needs, private inventory, developer news, and network questions." action="Create thread" onAction={onCreate} />
    <div className="discussion-list">
      {threads.map((thread) => <article className="discussion-thread" key={thread.id}>
        <div><span>{thread.type}</span><em>{thread.community}</em></div>
        <h3>{thread.title}</h3>
        <p>{thread.author} · {thread.lastActivity}</p>
        <div className="connect-meta-row"><small>{thread.replies} replies</small><small>{thread.useful} useful</small><small>{thread.followed ? "Following" : "Not following"}</small></div>
        <div className="connect-card-actions">
          <button onClick={() => onReply(thread.id)}><Reply size={13} />Reply</button>
          <button onClick={() => onFollow(thread.id)}>{thread.followed ? "Unfollow" : "Follow"}</button>
          <button onClick={() => onUseful(thread.id)}>Mark useful</button>
        </div>
      </article>)}
    </div>
  </section>;
}

function EventsTab({ events, onRsvp }: { events: ConnectEvent[]; onRsvp: (id: string) => void }) {
  return <section className="connect-panel">
    <PanelHeader eyebrow="CON-014" title="Events and workshops" detail="Broker workshops, market briefings, advisory roundtables, and founding broker sessions." action="Propose workshop" onAction={() => undefined} />
    <div className="connect-card-grid three">
      {events.map((event) => <article className="event-card" key={event.id}>
        <div><span>{event.type}</span><em>{event.rsvp}</em></div>
        <h3>{event.title}</h3>
        <p>{event.host} · {event.date}</p>
        <InfoLine label="Audience" value={event.audience} />
        <InfoLine label="Resource" value={event.resource} />
        <button onClick={() => onRsvp(event.id)}>{event.rsvp === "Going" ? "Cancel RSVP" : "RSVP"}</button>
      </article>)}
    </div>
  </section>;
}

function PanelHeader({ eyebrow, title, detail, action, onAction }: { eyebrow: string; title: string; detail: string; action: string; onAction: () => void }) {
  return <header className="connect-panel-header"><div><span>{eyebrow}</span><h2>{title}</h2><p>{detail}</p></div><button onClick={onAction}><Plus size={14} />{action}</button></header>;
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select>;
}

function BrokerCard({ broker, onOpen, onRequest }: { broker: ConnectBrokerProfile; onOpen: () => void; onRequest: () => void }) {
  return <article className="connect-broker-card">
    <div className="connect-card-top"><Avatar label={broker.avatar} /><span className={`connect-badge ${slug(broker.badge)}`}>{broker.badge}</span></div>
    <h3>{broker.name}</h3>
    <p>{broker.company} · {broker.reraNumber}</p>
    <div className="connect-score-line"><strong>{broker.trustScore}</strong><span>trust</span><b>{broker.responseRate}% response</b></div>
    <div className="connect-tags">{broker.specialties.map((item) => <em key={item}>{item}</em>)}</div>
    <small>{broker.areasServed.join(" · ")}</small>
    <div className="connect-card-actions"><button onClick={onOpen}>View profile</button><button onClick={onRequest}>Request</button></div>
  </article>;
}

function AgencyRow({ agency, onOpen }: { agency: ConnectAgencyProfile; onOpen: () => void }) {
  return <button className="connect-agency-row" onClick={onOpen}>
    <Avatar label={agency.logo} />
    <span><strong>{agency.name}</strong><small>{agency.officeAreas.join(" · ")} · {agency.brokersCount} brokers</small></span>
    <em>{agency.verified ? "Verified" : "Review"}</em>
  </button>;
}

function Avatar({ label }: { label: string }) {
  return <i className="connect-avatar">{label}</i>;
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return <div className="connect-info-line"><span>{label}</span><strong>{value}</strong></div>;
}

function BrokerProfileModal({ broker, onClose, notify }: { broker: ConnectBrokerProfile; onClose: () => void; notify: (message: string) => void }) {
  const trust = calculateBrokerTrustScore(broker);
  return <UiModal title={broker.name} subtitle={`${broker.company} · ${broker.badge}`} onClose={onClose} size="large">
    <div className="connect-modal-profile">
      <Avatar label={broker.avatar} />
      <div><h3>{broker.name}</h3><p>{broker.bio}</p><div className="connect-tags">{broker.specialties.concat(broker.languages).map((item) => <em key={item}>{item}</em>)}</div></div>
      <div className="trust-score-card compact"><span>Trust</span><strong>{trust.score}</strong><p>{broker.responseRate}% response</p></div>
    </div>
    <div className="connect-two-columns">
      <div className="connect-mini-list"><InfoLine label="RERA" value={broker.reraNumber} /><InfoLine label="Areas served" value={broker.areasServed.join(", ")} /><InfoLine label="Active deals" value={String(broker.activeDeals)} /><InfoLine label="Referrals" value={String(broker.successfulReferrals)} /></div>
      <div className="trust-factor-list">{trust.factors.slice(0, 4).map((factor) => <div className="trust-factor" key={factor.label}><span><strong>{factor.label}</strong><small>{factor.explanation}</small></span><b>{factor.score}</b></div>)}</div>
    </div>
    <div className="form-actions"><button className="ghost-button" onClick={() => notify("Intro message copied")}>Copy intro</button><button className="primary-button" onClick={() => notify("Private request opened")}>Send private request</button></div>
  </UiModal>;
}

function AgencyProfileModal({ agency, onClose, notify }: { agency: ConnectAgencyProfile; onClose: () => void; notify: (message: string) => void }) {
  return <UiModal title={agency.name} subtitle={agency.verified ? "Verified agency profile" : "Agency profile under review"} onClose={onClose} size="large">
    <div className="connect-modal-profile">
      <Avatar label={agency.logo} />
      <div><h3>{agency.name}</h3><p>{agency.sharedInventory}</p><div className="connect-tags">{agency.specialties.map((item) => <em key={item}>{item}</em>)}</div></div>
      <div className="trust-score-card compact"><span>Response</span><strong>{agency.responseRate}%</strong><p>{agency.activeCollaborations} collaborations</p></div>
    </div>
    <div className="connect-card-grid three">
      <InfoBox label="Brokers" value={String(agency.brokersCount)} />
      <InfoBox label="Listings" value={String(agency.listingsCount)} />
      <InfoBox label="Office areas" value={agency.officeAreas.join(", ")} />
    </div>
    <div className="form-actions"><button className="ghost-button" onClick={() => notify("Agency inventory preview opened")}>View inventory</button><button className="primary-button" onClick={() => notify("Partnership request sent")}>Request partnership</button></div>
  </UiModal>;
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return <article className="connect-info-box"><span>{label}</span><strong>{value}</strong></article>;
}

function nextReferralStatus(status: ReferralRecord["status"]): ReferralRecord["status"] {
  const order: ReferralRecord["status"][] = ["Sent", "Accepted", "Working", "Won", "Paid"];
  const index = order.indexOf(status);
  if (status === "Lost") return "Accepted";
  return order[Math.min(order.length - 1, Math.max(0, index) + 1)];
}

function nextRoomStatus(status: ConnectDealRoom["status"]): ConnectDealRoom["status"] {
  const order: ConnectDealRoom["status"][] = ["Discovery", "Shortlist", "Viewing", "Negotiation", "Closed", "Archived"];
  const index = order.indexOf(status);
  return order[Math.min(order.length - 1, Math.max(0, index) + 1)];
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
