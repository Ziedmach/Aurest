export type AurestSectionId =
  | "home"
  | "intelligence"
  | "connect"
  | "broker"
  | "agency"
  | "buyer"
  | "listings"
  | "match"
  | "reports"
  | "admin";

export type AurestModuleStatus = "Live V1" | "V2 demo" | "API-ready" | "Coming next";

export type AurestModule = {
  id: string;
  sectionId: AurestSectionId;
  label: string;
  description: string;
  status: AurestModuleStatus;
  routeKey: string;
};

export type AurestSection = {
  id: AurestSectionId;
  label: string;
  description: string;
  modules: AurestModule[];
};

export type AurestLayerMetric = {
  layer: "Data" | "Intelligence" | "Productivity" | "Network" | "Monetization";
  metric: string;
  value: string;
  trend: string;
  source: string;
};

export type AurestOpportunity = {
  id: string;
  type: "Buyer" | "Listing" | "Community" | "Referral" | "Yield";
  context: string;
  score: number;
  reason: string;
  action: string;
};

export type AurestNetworkProfile = {
  id: string;
  kind: "Broker" | "Agency" | "Advisor";
  name: string;
  trustScore: number;
  specialties: string[];
  activeDeals: number;
  location: string;
};

export type AurestDealRoom = {
  id: string;
  buyer: string;
  broker: string;
  property: string;
  participants: string[];
  status: "Discovery" | "Shortlist" | "Viewing" | "Negotiation" | "Closed";
  nextAction: string;
};

export type AurestBuyerWorkspaceState = {
  buyer: string;
  requirements: string[];
  shortlistFeedback: { property: string; sentiment: "Interested" | "Maybe" | "Rejected"; note: string }[];
  viewingJourney: { step: string; status: "Done" | "Next" | "Pending"; date: string }[];
  buyerComments: string[];
};

export type AurestCommissionRecord = {
  deal: string;
  broker: string;
  agency: string;
  commissionSplit: string;
  status: "Projected" | "Approved" | "Paid" | "Disputed";
};

function defineModule(sectionId: AurestSectionId, label: string, description: string, status: AurestModuleStatus = "V2 demo"): AurestModule {
  return {
    id: `${sectionId}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    sectionId,
    label,
    description,
    status,
    routeKey: label,
  };
}

export const aurestSections: AurestSection[] = [
  {
    id: "home",
    label: "Aurest Home",
    description: "Daily command centre for priorities, opportunities, and alerts.",
    modules: [
      defineModule("home", "Dashboard", "Layer health, today’s priorities, and high-value next actions.", "Live V1"),
      defineModule("home", "Daily Brief", "Morning brief with market moves, buyer urgency, and follow-ups."),
      defineModule("home", "Opportunity Feed", "Ranked deal, buyer, listing, and referral opportunities."),
      defineModule("home", "Notifications", "Operational alerts across workspace, network, and reports."),
    ],
  },
  {
    id: "intelligence",
    label: "Aurest Intelligence",
    description: "Communities, buildings, benchmarks, POIs, trends, and heatmaps.",
    modules: [
      defineModule("intelligence", "Community Intelligence", "Community-level lifestyle, demand, pricing, and buyer fit."),
      defineModule("intelligence", "Building Intelligence", "Building and project signals for broker advisory."),
      defineModule("intelligence", "Market Benchmarks", "Price, rent, AED/m², and sample-size market comparisons.", "Live V1"),
      defineModule("intelligence", "Yield Estimator", "Indicative rental yield and assumption management.", "Live V1"),
      defineModule("intelligence", "Google Maps / POI Enrichment", "POI readiness for schools, transport, parks, and business hubs.", "API-ready"),
      defineModule("intelligence", "Top Trending Places", "Demand, listing, and buyer-search trend detection."),
      defineModule("intelligence", "Market Heatmaps", "Visual heatmap placeholder for opportunity density."),
    ],
  },
  {
    id: "connect",
    label: "Aurest Connect",
    description: "Broker network, referrals, advisory trust, and shared deal rooms.",
    modules: [
      defineModule("connect", "Broker Network", "Trusted brokers, specialties, and collaboration opportunities."),
      defineModule("connect", "Agency Network", "Agency profiles, shared reach, and partnership paths."),
      defineModule("connect", "Verification", "Broker verification workflow, document checks, and admin review."),
      defineModule("connect", "Founding Brokers", "Early partner benefits, badge criteria, and launch cohort management."),
      defineModule("connect", "Private Requests", "Private inventory, buyer needs, valuation opinions, and viewing help."),
      defineModule("connect", "Deal Sharing", "Confidential shared deals with access and commission terms."),
      defineModule("connect", "Deal Rooms", "Collaborative rooms for buyer, broker, and property workflows."),
      defineModule("connect", "Referrals", "Inbound and outbound referral tracking."),
      defineModule("connect", "Advisory Council", "Expert advisors and market council placeholder."),
      defineModule("connect", "Trust Score", "Network trust and collaboration score signals."),
      defineModule("connect", "Broker Ranking", "Demo ranking board by community and specialty."),
      defineModule("connect", "Discussions", "Community discussion threads and market questions."),
      defineModule("connect", "Events", "Workshops, market briefings, and founding broker sessions."),
    ],
  },
  {
    id: "broker",
    label: "Broker Workspace",
    description: "CRM, matching, shortlists, pitches, reports, and deal pipeline.",
    modules: [
      defineModule("broker", "Buyer CRM", "Operational buyer list, status, timeline, and next action.", "Live V1"),
      defineModule("broker", "Property Matching", "Buyer-to-property recommendations and fit matrix.", "Live V1"),
      defineModule("broker", "Shortlists", "Buyer-linked collections and saved options.", "Live V1"),
      defineModule("broker", "WhatsApp Pitch", "Sales content generation for buyer outreach.", "Live V1"),
      defineModule("broker", "Reports", "Report studio and comparison reports.", "Live V1"),
      defineModule("broker", "Deal Pipeline", "Deal stages from lead to won/lost."),
    ],
  },
  {
    id: "agency",
    label: "Agency Workspace",
    description: "Team operations, shared inventory, performance, and commissions.",
    modules: [
      defineModule("agency", "Team Management", "Users, roles, invites, and manager visibility.", "Live V1"),
      defineModule("agency", "Shared Inventory", "Workspace-wide property inventory controls."),
      defineModule("agency", "Lead Assignment", "Buyer ownership and reassignment workflows.", "Live V1"),
      defineModule("agency", "Broker Performance", "Team usage and broker performance analytics.", "Live V1"),
      defineModule("agency", "Commission Tracking", "Commission split and payout readiness."),
    ],
  },
  {
    id: "buyer",
    label: "Buyer Workspace",
    description: "Buyer-facing profile, requirements, feedback, and viewing journey.",
    modules: [
      defineModule("buyer", "Buyer Profile", "Buyer identity, requirements, and advisory summary.", "Live V1"),
      defineModule("buyer", "Requirement Capture", "Guided intake for needs, budget, lifestyle, and intent."),
      defineModule("buyer", "Shortlist Review", "Buyer review workspace for comparing shortlisted homes."),
      defineModule("buyer", "Feedback", "Buyer sentiment and comments on recommendations."),
      defineModule("buyer", "Viewing Journey", "Viewing stages, reminders, and next-step tracking."),
    ],
  },
  {
    id: "listings",
    label: "Listings",
    description: "Scraped, manual, developer, quality, duplicate, and price history data.",
    modules: [
      defineModule("listings", "Scraped Listings", "Portal-imported listings normalized into Aurest schema.", "Live V1"),
      defineModule("listings", "Manual Listings", "Broker-created listings and brochure extraction readiness.", "Live V1"),
      defineModule("listings", "Developer Inventory", "Developer and off-plan inventory placeholder."),
      defineModule("listings", "Duplicate Detection", "Cross-source duplicate review and confidence scoring.", "Live V1"),
      defineModule("listings", "Listing Quality Score", "Completeness, reliability, and report-readiness scoring.", "Live V1"),
      defineModule("listings", "Price History", "Price movement and freshness tracking.", "Live V1"),
    ],
  },
  {
    id: "match",
    label: "Match",
    description: "Buyer, investor, broker, and opportunity scoring.",
    modules: [
      defineModule("match", "Buyer Match", "Buyer-property match score and explainable fit.", "Live V1"),
      defineModule("match", "Investor Match", "Investor-focused opportunities by yield, liquidity, and risk."),
      defineModule("match", "Broker Match", "Network routing for broker collaboration and referrals."),
      defineModule("match", "Opportunity Scoring", "Composite score across buyer, market, data, and timing."),
    ],
  },
  {
    id: "reports",
    label: "Reports",
    description: "Buyer, investment, community, and agency-branded reports.",
    modules: [
      defineModule("reports", "Buyer Reports", "Buyer-specific property and comparison reports.", "Live V1"),
      defineModule("reports", "Investment Reports", "Yield, comparables, and investor advisory reports.", "Live V1"),
      defineModule("reports", "Community Reports", "Community intelligence reports and area summaries."),
      defineModule("reports", "Agency Branded Reports", "Agency-approved branded report output.", "Live V1"),
    ],
  },
  {
    id: "admin",
    label: "Admin",
    description: "Users, data sources, permissions, billing, and audit logs.",
    modules: [
      defineModule("admin", "Users & Roles", "Workspace roles, permissions, and invite state.", "Live V1"),
      defineModule("admin", "Data Sources", "Portal, DLD, POI, and manual source readiness.", "API-ready"),
      defineModule("admin", "Permissions", "Role and workspace access controls.", "Live V1"),
      defineModule("admin", "Billing", "Plans, limits, usage, and upgrade paths.", "Live V1"),
      defineModule("admin", "Audit Logs", "Security and activity audit trail.", "Live V1"),
    ],
  },
];

export const aurestModules = aurestSections.flatMap((section) => section.modules);

export function getAurestModule(routeKey: string) {
  return aurestModules.find((item) => item.routeKey === routeKey || item.label === routeKey);
}

export const aurestLayerMetrics: AurestLayerMetric[] = [
  { layer: "Data", metric: "Listings normalized", value: "18.4K", trend: "+412 today", source: "Listings, communities, buildings, prices, POIs, reviews, transactions" },
  { layer: "Intelligence", metric: "Opportunity score avg.", value: "74", trend: "+6 pts", source: "Benchmarks, valuation, yield, trend detection" },
  { layer: "Productivity", metric: "Broker actions", value: "286", trend: "+18%", source: "Buyer CRM, matching, reports, WhatsApp, pipelines" },
  { layer: "Network", metric: "Active collaborations", value: "31", trend: "+7 rooms", source: "Brokers, agencies, advisors, referrals, deal rooms" },
  { layer: "Monetization", metric: "Plan utilization", value: "62%", trend: "healthy", source: "Subscriptions, intelligence plans, agency plans, referral fees" },
];

export const aurestOpportunities: AurestOpportunity[] = [
  { id: "opp_001", type: "Buyer", context: "Omar · investor buyer · Dubai Marina", score: 91, reason: "Three fresh 2-bed units now sit below area AED/m² benchmark.", action: "Send investor pitch" },
  { id: "opp_002", type: "Listing", context: "Dubai Hills · family townhouse", score: 86, reason: "High family fit, strong school proximity, and only 4 days on market.", action: "Create comparison report" },
  { id: "opp_003", type: "Community", context: "JVC · yield heat", score: 82, reason: "Buyer demand and rental benchmark both moved up this week.", action: "Open community intel" },
  { id: "opp_004", type: "Referral", context: "Luxury villa buyer · Palm Jumeirah", score: 78, reason: "A trusted network broker has matching off-market inventory.", action: "Open deal room" },
];

export const aurestNetworkProfiles: AurestNetworkProfile[] = [
  { id: "net_001", kind: "Broker", name: "Leila Haddad", trustScore: 94, specialties: ["Palm villas", "Luxury buyers"], activeDeals: 6, location: "Palm Jumeirah" },
  { id: "net_002", kind: "Agency", name: "Apex Living", trustScore: 89, specialties: ["Downtown", "Developer stock"], activeDeals: 18, location: "Downtown Dubai" },
  { id: "net_003", kind: "Advisor", name: "Rami Nasser", trustScore: 92, specialties: ["Mortgage", "Investor structuring"], activeDeals: 4, location: "Dubai Marina" },
];

export const aurestDealRooms: AurestDealRoom[] = [
  { id: "room_001", buyer: "Sarah Ahmed", broker: "Zied Machkena", property: "Dubai Hills Maple Villa", participants: ["Buyer", "Listing broker", "Mortgage advisor"], status: "Viewing", nextAction: "Confirm Saturday viewing window" },
  { id: "room_002", buyer: "Omar Al Mansoori", broker: "Zied Machkena", property: "Marina Vista 2BR", participants: ["Buyer", "Referral broker"], status: "Negotiation", nextAction: "Send DLD comparable pack" },
];

export const aurestBuyerWorkspace: AurestBuyerWorkspaceState = {
  buyer: "Sarah Ahmed",
  requirements: ["3 bedrooms", "Close to schools", "Family community", "Budget AED 4.2M", "Move-in ready preferred"],
  shortlistFeedback: [
    { property: "Dubai Hills Maple Villa", sentiment: "Interested", note: "Liked parks and school access." },
    { property: "Arabian Ranches townhouse", sentiment: "Maybe", note: "Good layout but commute is a concern." },
    { property: "JVC duplex", sentiment: "Rejected", note: "Too far from preferred school." },
  ],
  viewingJourney: [
    { step: "Requirements captured", status: "Done", date: "Today 09:10" },
    { step: "Shortlist shared", status: "Done", date: "Today 10:35" },
    { step: "Buyer feedback", status: "Next", date: "Tomorrow" },
    { step: "Viewing booked", status: "Pending", date: "This week" },
  ],
  buyerComments: ["Prefers bright layouts.", "Wants school commute under 15 minutes.", "Open to higher budget for the right community."],
};

export const aurestCommissionRecords: AurestCommissionRecord[] = [
  { deal: "Marina Vista 2BR", broker: "Zied Machkena", agency: "Aurest Demo Realty", commissionSplit: "70 / 30", status: "Projected" },
  { deal: "Dubai Hills Maple Villa", broker: "Nour Saleh", agency: "Aurest Demo Realty", commissionSplit: "60 / 40", status: "Approved" },
  { deal: "JVC high-yield unit", broker: "Adam Khan", agency: "Aurest Demo Realty", commissionSplit: "50 / 50 referral", status: "Paid" },
];
