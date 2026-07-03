import { initialBuyerProfiles, type BuyerProfile, type BuyerStatus } from "@/lib/buyer-data";
import { initialProperties, type PropertyRecord } from "@/lib/property-data";
import { scoreBuyerProperty, type ExplainableMatch } from "@/lib/matching-engine";
import { soloBrokerMetrics } from "@/lib/analytics-quality";
import { aurestCommissionRecords } from "@/lib/aurest-data";

export type BrokerHubTab = "CRM" | "Requirements" | "AI Brief" | "Shortlist" | "Matching" | "Pitch" | "Reports" | "Pipeline" | "Viewings" | "Follow-ups" | "Commission" | "Analytics";
export type BrokerFullWorkflow = "Buyer CRM" | "Matching" | "Sales Copilot" | "Report Studio" | "Saved Searches";

export type BrokerWorkspaceFeature = {
  id: string;
  code: string;
  tab: BrokerHubTab;
  title: string;
  priority: "P0" | "P1" | "P2";
  summary: string;
  fullWorkflow?: BrokerFullWorkflow;
};

export type BrokerPipelineDeal = {
  id: string;
  buyerId: string;
  propertyId: string;
  status: BuyerStatus;
  value: number;
  probability: number;
  nextAction: string;
  updatedAt: string;
};

export type BrokerViewing = {
  id: string;
  buyerId: string;
  propertyId: string;
  scheduledAt: string;
  status: "Requested" | "Confirmed" | "Completed" | "Cancelled";
  feedback: string;
  nextAction: string;
};

export type BrokerFollowUpReminder = {
  id: string;
  buyerId: string;
  propertyId: string;
  dueAt: string;
  priority: "Overdue" | "Due today" | "Upcoming";
  reason: string;
  done: boolean;
  snoozed: boolean;
};

export type BrokerShortlist = {
  id: string;
  buyerId: string;
  name: string;
  propertyIds: string[];
  visibility: "Private" | "Workspace shared";
  updatedAt: string;
};

export type BrokerCommissionSummary = {
  projected: number;
  approved: number;
  paid: number;
  disputed: number;
};

export type BrokerPersonalAnalytics = ReturnType<typeof soloBrokerMetrics> & {
  pitchesCopied: number;
  followUpsDone: number;
  wonLost: string;
};

export const brokerHubTabs: BrokerHubTab[] = ["CRM", "Requirements", "AI Brief", "Shortlist", "Matching", "Pitch", "Reports", "Pipeline", "Viewings", "Follow-ups", "Commission", "Analytics"];

export const brokerWorkspaceFeatures: BrokerWorkspaceFeature[] = [
  { id: "brk_001", code: "BRK-001", tab: "CRM", title: "Buyer CRM", priority: "P0", summary: "Operational buyer list with status, owner, next action and activity.", fullWorkflow: "Buyer CRM" },
  { id: "brk_002", code: "BRK-002", tab: "Requirements", title: "Buyer requirement form", priority: "P0", summary: "Quick requirement preview using the existing buyer profile schema.", fullWorkflow: "Buyer CRM" },
  { id: "brk_003", code: "BRK-003", tab: "AI Brief", title: "AI buyer brief", priority: "P0", summary: "Persona, motivation, objections, suggested areas and sales angle.", fullWorkflow: "Buyer CRM" },
  { id: "brk_004", code: "BRK-004", tab: "Shortlist", title: "Property shortlist", priority: "P0", summary: "Buyer-grouped shortlists with local add/remove actions.", fullWorkflow: "Saved Searches" },
  { id: "brk_005", code: "BRK-005", tab: "Matching", title: "AI matching score", priority: "P0", summary: "Explainable buyer-property match score and deal score.", fullWorkflow: "Matching" },
  { id: "brk_006", code: "BRK-006", tab: "Pitch", title: "WhatsApp pitch generator", priority: "P0", summary: "One-click deterministic pitch preview for buyer and property.", fullWorkflow: "Sales Copilot" },
  { id: "brk_007", code: "BRK-007", tab: "Reports", title: "Buyer report generator", priority: "P0", summary: "Single-property and comparison report entry points.", fullWorkflow: "Report Studio" },
  { id: "brk_008", code: "BRK-008", tab: "Pipeline", title: "Deal pipeline", priority: "P1", summary: "Local buyer status board from lead to won/lost." },
  { id: "brk_009", code: "BRK-009", tab: "Viewings", title: "Viewing tracker", priority: "P1", summary: "Viewing schedule, status, feedback and next action." },
  { id: "brk_010", code: "BRK-010", tab: "Follow-ups", title: "Follow-up reminders", priority: "P1", summary: "Due, overdue and upcoming reminders with local actions." },
  { id: "brk_011", code: "BRK-011", tab: "Commission", title: "Commission tracker", priority: "P2", summary: "Projected, approved, paid and disputed commission records." },
  { id: "brk_012", code: "BRK-012", tab: "Analytics", title: "Broker personal analytics", priority: "P2", summary: "Personal usage, buyer, report, pitch and follow-up metrics." },
];

export const initialBrokerPipeline: BrokerPipelineDeal[] = [
  { id: "pipe_omar", buyerId: "buy_omar", propertyId: "prop_bayut_983410", status: "Qualified", value: 2_750_000, probability: 42, nextAction: "Send investor comparison report", updatedAt: "Today · 09:42" },
  { id: "pipe_sarah", buyerId: "buy_sarah", propertyId: "prop_dubizzle_72411", status: "Viewing scheduled", value: 4_800_000, probability: 58, nextAction: "Confirm family viewing feedback", updatedAt: "Today · 08:30" },
  { id: "pipe_james", buyerId: "buy_james", propertyId: "prop_dubizzle_88220", status: "Report sent", value: 145_000, probability: 35, nextAction: "Follow up relocation shortlist", updatedAt: "Yesterday · 17:10" },
  { id: "pipe_lina", buyerId: "buy_lina", propertyId: "prop_bayut_55109", status: "New lead", value: 1_900_000, probability: 20, nextAction: "Complete off-plan qualification", updatedAt: "23 Jun · 14:15" },
];

export const initialBrokerViewings: BrokerViewing[] = [
  { id: "view_1", buyerId: "buy_sarah", propertyId: "prop_dubizzle_72411", scheduledAt: "26 Jun · 10:30", status: "Confirmed", feedback: "Family wants to validate park access and school route.", nextAction: "Send reminder morning of viewing" },
  { id: "view_2", buyerId: "buy_omar", propertyId: "prop_bayut_983410", scheduledAt: "27 Jun · 16:00", status: "Requested", feedback: "Investor wants service-charge and rent evidence before confirming.", nextAction: "Share DLD/yield note" },
  { id: "view_3", buyerId: "buy_james", propertyId: "prop_dubizzle_88220", scheduledAt: "29 Jun · 12:15", status: "Completed", feedback: "Liked location, worried about annual rent ceiling.", nextAction: "Send alternative Downtown option" },
];

export const initialBrokerFollowUps: BrokerFollowUpReminder[] = [
  { id: "fu_1", buyerId: "buy_omar", propertyId: "prop_bayut_983410", dueAt: "Today · 16:00", priority: "Due today", reason: "Report opened and pitch copied", done: false, snoozed: false },
  { id: "fu_2", buyerId: "buy_sarah", propertyId: "prop_dubizzle_72411", dueAt: "Overdue · 09:00", priority: "Overdue", reason: "Viewing reminder not confirmed", done: false, snoozed: false },
  { id: "fu_3", buyerId: "buy_lina", propertyId: "prop_bayut_55109", dueAt: "Tomorrow", priority: "Upcoming", reason: "Off-plan qualification incomplete", done: false, snoozed: false },
];

export const initialBrokerShortlists: BrokerShortlist[] = [
  { id: "sl_omar", buyerId: "buy_omar", name: "Investor deals", propertyIds: ["prop_bayut_983410", "prop_bayut_55109"], visibility: "Workspace shared", updatedAt: "Today" },
  { id: "sl_sarah", buyerId: "buy_sarah", name: "Family shortlist", propertyIds: ["prop_dubizzle_72411"], visibility: "Private", updatedAt: "Yesterday" },
  { id: "sl_james", buyerId: "buy_james", name: "Relocation options", propertyIds: ["prop_dubizzle_88220"], visibility: "Workspace shared", updatedAt: "22 Jun" },
];

export function brokerBuyer(id: string) {
  return initialBuyerProfiles.find((buyer) => buyer.id === id) ?? initialBuyerProfiles[0];
}

export function brokerProperty(id: string) {
  return initialProperties.find((property) => property.id === id) ?? initialProperties[0];
}

export function topBrokerMatches(limit = 4): Array<{ buyer: BuyerProfile; property: PropertyRecord; match: ExplainableMatch }> {
  return initialBuyerProfiles.flatMap((buyer) => initialProperties.map((property) => ({ buyer, property, match: scoreBuyerProperty(buyer, property) })))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit);
}

export function brokerCommissionSummary(): BrokerCommissionSummary {
  return aurestCommissionRecords.reduce<BrokerCommissionSummary>((totals, record, index) => {
    const amount = [54_000, 38_000, 29_000][index] ?? 18_000;
    if (record.status === "Projected") totals.projected += amount;
    if (record.status === "Approved") totals.approved += amount;
    if (record.status === "Paid") totals.paid += amount;
    if (record.status === "Disputed") totals.disputed += amount;
    return totals;
  }, { projected: 0, approved: 0, paid: 0, disputed: 0 });
}

export function brokerPersonalAnalytics(): BrokerPersonalAnalytics {
  const metrics = soloBrokerMetrics();
  return {
    ...metrics,
    pitchesCopied: 44,
    followUpsDone: 17,
    wonLost: "3 won / 1 lost",
  };
}

export function routeToBrokerTab(route: string): BrokerHubTab {
  if (route === "Property Matching") return "Matching";
  if (route === "Shortlists") return "Shortlist";
  if (route === "WhatsApp Pitch") return "Pitch";
  if (route === "Reports") return "Reports";
  if (route === "Deal Pipeline") return "Pipeline";
  if (route === "Buyer CRM") return "CRM";
  return "CRM";
}

export const brokerPipelineStatuses: BuyerStatus[] = ["New lead", "Qualified", "Shortlist sent", "Report sent", "Viewing scheduled", "Negotiation", "Won", "Lost", "On hold"];
