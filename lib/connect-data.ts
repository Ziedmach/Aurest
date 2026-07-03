export type ConnectTab =
  | "Directory"
  | "Profiles"
  | "Verification"
  | "Private Requests"
  | "Deal Sharing"
  | "Deal Rooms"
  | "Referrals"
  | "Advisory Council"
  | "Trust & Rankings"
  | "Discussions"
  | "Events";

export type ConnectBadge = "Founding Broker" | "Verified Broker" | "Advisory Member" | "New Member";
export type BrokerVerificationStatus = "Not started" | "In review" | "Verified" | "Rejected";
export type VerificationStepStatus = "Done" | "In review" | "Pending" | "Rejected";

export type BrokerVerificationStep = {
  id: string;
  label: string;
  detail: string;
  status: VerificationStepStatus;
};

export type ConnectBrokerProfile = {
  id: string;
  name: string;
  company: string;
  reraNumber: string;
  avatar: string;
  badge: ConnectBadge;
  verified: boolean;
  verificationStatus: BrokerVerificationStatus;
  specialties: string[];
  languages: string[];
  areasServed: string[];
  activeDeals: number;
  responseRate: number;
  trustScore: number;
  successfulReferrals: number;
  peerEndorsements: number;
  joined: string;
  profileCompletion: number;
  bio: string;
};

export type ConnectAgencyProfile = {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  officeAreas: string[];
  brokersCount: number;
  listingsCount: number;
  specialties: string[];
  activeCollaborations: number;
  responseRate: number;
  sharedInventory: string;
};

export type PrivateBrokerRequest = {
  id: string;
  type: "Private inventory" | "Buyer need" | "Referral help" | "Valuation opinion" | "Viewing support";
  title: string;
  requester: string;
  area: string;
  budget: string;
  confidentiality: "Open to verified brokers" | "Invite only" | "Agency partners";
  status: "Open" | "Responded" | "Matched" | "Closed";
  responses: number;
  expires: string;
};

export type SharedDeal = {
  id: string;
  property: string;
  buyerNeed: string;
  area: string;
  commissionTerms: string;
  confidentiality: "NDA required" | "Verified brokers only" | "Agency partners";
  expiry: string;
  allowedParticipants: string[];
  status: "Shared" | "Access requested" | "Room opened";
};

export type ConnectDealRoom = {
  id: string;
  buyer: string;
  property: string;
  leadBroker: string;
  participants: string[];
  status: "Discovery" | "Shortlist" | "Viewing" | "Negotiation" | "Closed" | "Archived";
  nextAction: string;
  checklist: { item: string; done: boolean }[];
  documents: string[];
  timeline: string[];
  notes: string[];
};

export type ReferralRecord = {
  id: string;
  sourceBroker: string;
  receivingBroker: string;
  context: string;
  referralFee: string;
  status: "Sent" | "Accepted" | "Working" | "Won" | "Lost" | "Paid";
  lastUpdate: string;
  nextAction: string;
};

export type AdvisoryCouncilItem = {
  id: string;
  advisor: string;
  specialty: string;
  openQuestion: string;
  marketNote: string;
  workshopTopic: string;
  responseStatus: "Open" | "Answered" | "Scheduled";
};

export type BrokerTrustScore = {
  brokerId: string;
  score: number;
  factors: { label: string; score: number; explanation: string }[];
  improvements: string[];
};

export type BrokerRankingEntry = {
  id: string;
  broker: string;
  community: string;
  specialty: string;
  badge: ConnectBadge;
  score: number;
  rank: number;
  metric: string;
};

export type CommunityDiscussionThread = {
  id: string;
  community: string;
  type: "Market update" | "Buyer need" | "Private inventory" | "Developer news" | "Question";
  title: string;
  author: string;
  replies: number;
  useful: number;
  followed: boolean;
  lastActivity: string;
};

export type ConnectEvent = {
  id: string;
  type: "Broker workshop" | "Market briefing" | "Advisory roundtable" | "Founding broker session";
  title: string;
  host: string;
  audience: string;
  date: string;
  rsvp: "Not RSVP’d" | "Going" | "Waitlist";
  resource: string;
};

export type BrokerDirectoryFilters = {
  query?: string;
  area?: string;
  specialty?: string;
  language?: string;
  badge?: string;
  agency?: string;
  verifiedOnly?: boolean;
  minTrust?: number;
  sortBy?: "Trust score" | "Active deals" | "Newest" | "Response rate";
};

export const connectBrokers: ConnectBrokerProfile[] = [
  {
    id: "broker_leila",
    name: "Leila Haddad",
    company: "Apex Living",
    reraNumber: "RERA-48219",
    avatar: "LH",
    badge: "Founding Broker",
    verified: true,
    verificationStatus: "Verified",
    specialties: ["Palm villas", "Luxury buyers", "Off-market"],
    languages: ["English", "Arabic", "French"],
    areasServed: ["Palm Jumeirah", "Dubai Hills", "Emirates Hills"],
    activeDeals: 6,
    responseRate: 96,
    trustScore: 94,
    successfulReferrals: 12,
    peerEndorsements: 18,
    joined: "2026-02-18",
    profileCompletion: 98,
    bio: "Luxury-focused broker with strong villa inventory and fast co-broker response habits.",
  },
  {
    id: "broker_omar",
    name: "Omar Khatib",
    company: "Harbour Gate Realty",
    reraNumber: "RERA-51730",
    avatar: "OK",
    badge: "Verified Broker",
    verified: true,
    verificationStatus: "Verified",
    specialties: ["Investor buyers", "Dubai Marina", "Yield"],
    languages: ["English", "Arabic"],
    areasServed: ["Dubai Marina", "JBR", "JLT"],
    activeDeals: 9,
    responseRate: 91,
    trustScore: 89,
    successfulReferrals: 8,
    peerEndorsements: 14,
    joined: "2026-03-04",
    profileCompletion: 94,
    bio: "Investor-oriented broker who shares clean comparable packs and rental assumptions.",
  },
  {
    id: "broker_maya",
    name: "Maya Sayegh",
    company: "District & Co",
    reraNumber: "Pending",
    avatar: "MS",
    badge: "Advisory Member",
    verified: false,
    verificationStatus: "In review",
    specialties: ["Family relocation", "Schools", "Dubai Hills"],
    languages: ["English", "French"],
    areasServed: ["Dubai Hills", "Arabian Ranches", "Meydan"],
    activeDeals: 4,
    responseRate: 88,
    trustScore: 84,
    successfulReferrals: 5,
    peerEndorsements: 11,
    joined: "2026-04-11",
    profileCompletion: 87,
    bio: "Family relocation specialist with a practical lens on schools, commute, and community feel.",
  },
  {
    id: "broker_yusuf",
    name: "Yusuf Rahman",
    company: "Creekfront Advisory",
    reraNumber: "RERA-50988",
    avatar: "YR",
    badge: "New Member",
    verified: false,
    verificationStatus: "Not started",
    specialties: ["Off-plan", "Creek Harbour", "Developer launches"],
    languages: ["English", "Arabic", "Hindi"],
    areasServed: ["Dubai Creek Harbour", "Business Bay", "Downtown Dubai"],
    activeDeals: 3,
    responseRate: 78,
    trustScore: 73,
    successfulReferrals: 2,
    peerEndorsements: 4,
    joined: "2026-05-26",
    profileCompletion: 72,
    bio: "New network member with developer-launch access and growing off-plan collaboration history.",
  },
];

export const connectAgencies: ConnectAgencyProfile[] = [
  { id: "agency_apex", name: "Apex Living", logo: "AL", verified: true, officeAreas: ["Palm Jumeirah", "Downtown Dubai"], brokersCount: 42, listingsCount: 318, specialties: ["Luxury", "Developer stock", "Prime villas"], activeCollaborations: 18, responseRate: 94, sharedInventory: "92 verified listings shared with partners" },
  { id: "agency_harbour", name: "Harbour Gate Realty", logo: "HG", verified: true, officeAreas: ["Dubai Marina", "JBR", "JLT"], brokersCount: 27, listingsCount: 211, specialties: ["Waterfront apartments", "Investor stock"], activeCollaborations: 13, responseRate: 90, sharedInventory: "64 Marina listings available for co-broker requests" },
  { id: "agency_district", name: "District & Co", logo: "DC", verified: false, officeAreas: ["Dubai Hills", "Arabian Ranches"], brokersCount: 18, listingsCount: 126, specialties: ["Family relocation", "Townhouses"], activeCollaborations: 7, responseRate: 86, sharedInventory: "Family homes inventory under verification review" },
];

export const verificationSteps: BrokerVerificationStep[] = [
  { id: "profile", label: "Profile completed", detail: "Name, photo, company, areas, languages, and contact fields.", status: "Done" },
  { id: "rera", label: "RERA uploaded", detail: "License reference attached for admin review.", status: "In review" },
  { id: "agency", label: "Agency confirmed", detail: "Agency relationship or independent status confirmed.", status: "Pending" },
  { id: "identity", label: "Identity checked", detail: "Identity check placeholder for production provider.", status: "Pending" },
  { id: "admin", label: "Admin approved", detail: "Platform owner approves final verified badge.", status: "Pending" },
];

export const privateBrokerRequests: PrivateBrokerRequest[] = [
  { id: "req_001", type: "Private inventory", title: "Need off-market Palm 4BR villa under AED 22M", requester: "Leila Haddad", area: "Palm Jumeirah", budget: "AED 18M–22M", confidentiality: "Invite only", status: "Open", responses: 3, expires: "2 days" },
  { id: "req_002", type: "Buyer need", title: "Family buyer wants Dubai Hills townhouse near schools", requester: "Maya Sayegh", area: "Dubai Hills", budget: "AED 3.8M–4.6M", confidentiality: "Open to verified brokers", status: "Responded", responses: 7, expires: "5 days" },
  { id: "req_003", type: "Valuation opinion", title: "Need quick benchmark on Marina 2BR high floor", requester: "Omar Khatib", area: "Dubai Marina", budget: "AED 2.4M target", confidentiality: "Agency partners", status: "Matched", responses: 4, expires: "Tomorrow" },
];

export const sharedDeals: SharedDeal[] = [
  { id: "deal_001", property: "Palm Jumeirah Garden Home", buyerNeed: "Cash luxury buyer wants privacy and sea access", area: "Palm Jumeirah", commissionTerms: "50/50 split after verified viewing", confidentiality: "NDA required", expiry: "48h", allowedParticipants: ["Verified Broker", "Founding Broker"], status: "Shared" },
  { id: "deal_002", property: "Marina Vista 2BR", buyerNeed: "Investor requires 6%+ indicative yield", area: "Dubai Marina", commissionTerms: "25% referral fee on close", confidentiality: "Verified brokers only", expiry: "6 days", allowedParticipants: ["Investor specialists"], status: "Access requested" },
  { id: "deal_003", property: "Dubai Hills Maple Townhouse", buyerNeed: "Relocation family comparing school access", area: "Dubai Hills", commissionTerms: "Co-broker split by introduced buyer", confidentiality: "Agency partners", expiry: "9 days", allowedParticipants: ["Family specialists", "Agency partners"], status: "Room opened" },
];

export const connectDealRooms: ConnectDealRoom[] = [
  { id: "room_001", buyer: "Sarah Ahmed", property: "Dubai Hills Maple Villa", leadBroker: "Zied Machkena", participants: ["Buyer broker", "Listing broker", "Mortgage advisor"], status: "Viewing", nextAction: "Confirm Saturday viewing window", checklist: [{ item: "Buyer brief shared", done: true }, { item: "DLD comparables attached", done: true }, { item: "Viewing slot confirmed", done: false }], documents: ["Buyer brief", "Comparable pack"], timeline: ["Room opened", "Listing broker accepted", "Viewing proposed"], notes: ["Buyer prefers Saturday morning."] },
  { id: "room_002", buyer: "Omar Al Mansoori", property: "Marina Vista 2BR", leadBroker: "Omar Khatib", participants: ["Investor broker", "Referral broker"], status: "Negotiation", nextAction: "Send revised price justification", checklist: [{ item: "Rental assumptions checked", done: true }, { item: "Seller terms requested", done: false }], documents: ["Yield estimate", "Price benchmark"], timeline: ["Access requested", "Deal room opened", "Offer range discussed"], notes: ["Avoid guaranteed yield language."] },
];

export const referralRecords: ReferralRecord[] = [
  { id: "ref_001", sourceBroker: "Leila Haddad", receivingBroker: "Zied Machkena", context: "Luxury villa buyer for Palm Jumeirah", referralFee: "25% referral fee", status: "Working", lastUpdate: "Today", nextAction: "Share shortlist by 17:00" },
  { id: "ref_002", sourceBroker: "Maya Sayegh", receivingBroker: "Omar Khatib", context: "Investor comparing Marina and JLT", referralFee: "50/50 co-broker split", status: "Accepted", lastUpdate: "Yesterday", nextAction: "Open investor deal room" },
  { id: "ref_003", sourceBroker: "Yusuf Rahman", receivingBroker: "Leila Haddad", context: "Off-plan buyer wants luxury resale alternative", referralFee: "AED 12K flat fee", status: "Sent", lastUpdate: "2 days ago", nextAction: "Await receiving broker response" },
];

export const advisoryCouncilItems: AdvisoryCouncilItem[] = [
  { id: "adv_001", advisor: "Rami Nasser", specialty: "Mortgage advisory", openQuestion: "How should brokers explain rate sensitivity to relocation buyers?", marketNote: "Buyers are asking for payment certainty more than headline discounts.", workshopTopic: "Financing objections in 2026 buyer calls", responseStatus: "Answered" },
  { id: "adv_002", advisor: "Noura Al Farsi", specialty: "Legal and conveyancing", openQuestion: "What should be included in off-plan risk notes?", marketNote: "Clear handover and escrow language reduces buyer confusion.", workshopTopic: "Off-plan documentation basics", responseStatus: "Scheduled" },
  { id: "adv_003", advisor: "Karim Mansour", specialty: "Investment strategy", openQuestion: "How to compare yield and liquidity across communities?", marketNote: "Investors respond well to assumption-led explanations, not promises.", workshopTopic: "Investor report storytelling", responseStatus: "Open" },
];

export const discussionThreads: CommunityDiscussionThread[] = [
  { id: "thread_001", community: "Dubai Hills", type: "Buyer need", title: "Family buyer needs 3BR near school, flexible on handover", author: "Maya Sayegh", replies: 8, useful: 14, followed: true, lastActivity: "21 min ago" },
  { id: "thread_002", community: "Dubai Marina", type: "Market update", title: "2BR high-floor pricing feels softer this week", author: "Omar Khatib", replies: 5, useful: 11, followed: false, lastActivity: "1h ago" },
  { id: "thread_003", community: "Palm Jumeirah", type: "Private inventory", title: "Quiet Garden Home seller open to verified buyers only", author: "Leila Haddad", replies: 3, useful: 9, followed: false, lastActivity: "3h ago" },
];

export const connectEvents: ConnectEvent[] = [
  { id: "evt_001", type: "Market briefing", title: "Q3 community demand signals", host: "Aurest Advisory Council", audience: "Verified brokers", date: "Jul 9, 2026 · 10:00", rsvp: "Not RSVP’d", resource: "Replay and slide pack after session" },
  { id: "evt_002", type: "Broker workshop", title: "Turning benchmarks into buyer trust", host: "Karim Mansour", audience: "Investor-focused brokers", date: "Jul 14, 2026 · 15:00", rsvp: "Going", resource: "Worksheet template included" },
  { id: "evt_003", type: "Founding broker session", title: "Founding Broker collaboration rules", host: "Aurest Network Team", audience: "Founding cohort", date: "Jul 21, 2026 · 12:30", rsvp: "Waitlist", resource: "Program checklist" },
];

export function getConnectBrokers() {
  return connectBrokers;
}

export function getConnectAgencies() {
  return connectAgencies;
}

export function filterBrokerDirectory(filters: BrokerDirectoryFilters) {
  const query = (filters.query ?? "").toLowerCase();
  let items = connectBrokers.filter((broker) => {
    const haystack = [broker.name, broker.company, broker.badge, ...broker.specialties, ...broker.languages, ...broker.areasServed].join(" ").toLowerCase();
    return (!query || haystack.includes(query))
      && (!filters.area || filters.area === "All areas" || broker.areasServed.includes(filters.area))
      && (!filters.specialty || filters.specialty === "All specialties" || broker.specialties.includes(filters.specialty))
      && (!filters.language || filters.language === "All languages" || broker.languages.includes(filters.language))
      && (!filters.badge || filters.badge === "All badges" || broker.badge === filters.badge)
      && (!filters.agency || filters.agency === "All agencies" || broker.company === filters.agency)
      && (!filters.verifiedOnly || broker.verified)
      && (!filters.minTrust || broker.trustScore >= filters.minTrust);
  });

  const sortBy = filters.sortBy ?? "Trust score";
  items = [...items].sort((a, b) => {
    if (sortBy === "Active deals") return b.activeDeals - a.activeDeals;
    if (sortBy === "Newest") return new Date(b.joined).getTime() - new Date(a.joined).getTime();
    if (sortBy === "Response rate") return b.responseRate - a.responseRate;
    return b.trustScore - a.trustScore;
  });
  return items;
}

export function calculateBrokerTrustScore(profile: ConnectBrokerProfile): BrokerTrustScore {
  const verification = profile.verified ? 100 : profile.verificationStatus === "In review" ? 68 : 40;
  const referrals = Math.min(100, 45 + profile.successfulReferrals * 5);
  const activity = Math.min(100, 55 + profile.activeDeals * 5);
  const endorsements = Math.min(100, 50 + profile.peerEndorsements * 3);
  const dispute = profile.trustScore > 80 ? 94 : 78;
  const score = Math.round((verification * .24) + (profile.profileCompletion * .16) + (profile.responseRate * .18) + (referrals * .16) + (activity * .12) + (endorsements * .1) + (dispute * .04));
  return {
    brokerId: profile.id,
    score,
    factors: [
      { label: "Verification status", score: verification, explanation: profile.verified ? "Verified profile and RERA reference." : "Verification is not complete yet." },
      { label: "Completed profile", score: profile.profileCompletion, explanation: "Profile depth, service areas, languages, and specialties." },
      { label: "Response rate", score: profile.responseRate, explanation: "Local demo response habit across requests and rooms." },
      { label: "Successful referrals", score: referrals, explanation: `${profile.successfulReferrals} successful referral signals.` },
      { label: "Deal room activity", score: activity, explanation: `${profile.activeDeals} active collaboration records.` },
      { label: "Peer endorsements", score: endorsements, explanation: `${profile.peerEndorsements} peer endorsements in demo data.` },
      { label: "Dispute flags", score: dispute, explanation: "No unresolved dispute flags in this fake workspace." },
    ],
    improvements: [
      profile.verified ? "Keep RERA and company details updated." : "Complete RERA and identity review to unlock verified badge.",
      profile.responseRate < 90 ? "Respond to private requests faster to improve network trust." : "Maintain fast response rate in deal rooms.",
      profile.peerEndorsements < 10 ? "Ask trusted collaborators for endorsements after closed referrals." : "Use endorsements in private request responses.",
    ],
  };
}

export function getBrokerRankings(scope = "All Dubai") {
  const base: BrokerRankingEntry[] = connectBrokers.map((broker, index) => ({
    id: `rank_${broker.id}`,
    broker: broker.name,
    community: scope === "All Dubai" ? broker.areasServed[0] : scope,
    specialty: broker.specialties[0],
    badge: broker.badge,
    score: broker.trustScore,
    rank: index + 1,
    metric: `${broker.activeDeals} active deals · ${broker.responseRate}% response`,
  })).sort((a, b) => b.score - a.score).map((item, index) => ({ ...item, rank: index + 1 }));
  return base;
}

export function getPrivateRequests() {
  return privateBrokerRequests;
}

export function getSharedDeals() {
  return sharedDeals;
}

export function getReferralRecords() {
  return referralRecords;
}

export function getDiscussionThreads() {
  return discussionThreads;
}

export function getConnectEvents() {
  return connectEvents;
}

export function routeToConnectTab(active: string): ConnectTab {
  if (active === "Agency Network") return "Profiles";
  if (active === "Verification" || active === "Founding Brokers" || active === "Founding Broker Program") return "Verification";
  if (active === "Private Requests") return "Private Requests";
  if (active === "Deal Sharing") return "Deal Sharing";
  if (active === "Deal Rooms") return "Deal Rooms";
  if (active === "Referrals" || active === "Referral Requests") return "Referrals";
  if (active === "Advisory Council") return "Advisory Council";
  if (active === "Trust Score" || active === "Broker Ranking") return "Trust & Rankings";
  if (active === "Discussions") return "Discussions";
  if (active === "Events") return "Events";
  return "Directory";
}
