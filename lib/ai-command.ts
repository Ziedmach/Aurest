import { initialBuyerProfiles, generateBuyerSummary, classifyBuyer, type BuyerProfile } from "@/lib/buyer-data";
import { initialProperties, type PropertyRecord } from "@/lib/property-data";
import { scoreBuyerProperty } from "@/lib/matching-engine";
import { generateWhatsAppMessage, generateFollowUps } from "@/lib/sales-content";
import { generateMarketExplanation, getAreaBenchmark } from "@/lib/market-intel";
import type { Workspace } from "@/lib/workspace";

export type AiMessageRole = "user" | "assistant" | "system";
export type AiCommandIntent =
  | "create_buyer"
  | "update_buyer_requirement"
  | "find_matches"
  | "generate_buyer_brief"
  | "create_shortlist"
  | "generate_whatsapp_pitch"
  | "generate_report"
  | "schedule_viewing"
  | "create_follow_up"
  | "summarize_market"
  | "open_module"
  | "unknown";

export type AiActionType =
  | "open_module"
  | "create_buyer"
  | "update_requirement"
  | "show_matches"
  | "save_brief"
  | "create_shortlist"
  | "copy_pitch"
  | "create_report"
  | "schedule_viewing"
  | "create_follow_up"
  | "include_market_summary";

export type AiActionCard = {
  id: string;
  type: AiActionType;
  title: string;
  description: string;
  targetModule: string;
  payload: Record<string, string | number | boolean>;
  requiresConfirmation: boolean;
  status: "preview" | "confirmed" | "dismissed";
};

export type AiConversationMessage = {
  id: string;
  role: AiMessageRole;
  body: string;
  createdAt: string;
  intent?: AiCommandIntent;
  confidence?: "High" | "Medium" | "Low";
  requiredContext?: string[];
  actions?: AiActionCard[];
  suggestions?: string[];
};

export type AiCommandContext = {
  workspace: Workspace;
  activeModule: string;
  selectedBuyerId?: string;
  selectedPropertyId?: string;
};

export type AiCommandResult = {
  intent: AiCommandIntent;
  confidence: "High" | "Medium" | "Low";
  assistantMessage: string;
  requiredContext: string[];
  actions: AiActionCard[];
  suggestions: string[];
};

export type AiActionHistoryItem = {
  id: string;
  actionId: string;
  actionType: AiActionType;
  title: string;
  targetModule: string;
  summary: string;
  confirmedAt: string;
};

export const aiQuickPrompts = [
  "Create a buyer for Omar with AED 3M budget in Dubai Marina.",
  "Find best matches for Sarah.",
  "Generate a WhatsApp pitch for the best property.",
  "Create a comparison report for this buyer.",
  "Add a follow-up tomorrow.",
  "Explain the market in Dubai Hills.",
  "Open the Broker Workspace.",
];

export const aiVoiceTranscripts = [
  "Find the best matches for Sarah and prepare a WhatsApp pitch.",
  "Create a buyer for Omar with three million dirham budget in Dubai Marina.",
  "Explain Dubai Hills market and add it to the report.",
  "Add a follow-up tomorrow for the investor buyer.",
];

const nowLabel = () => "Just now";
const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function buildInitialAiMessages(profileName: string): AiConversationMessage[] {
  return [
    {
      id: "ai_welcome",
      role: "assistant",
      body: `Hi ${profileName.split(" ")[0] || "there"} — I’m Aurest AI. Tell me what you want to do and I’ll turn it into confirmable broker actions.`,
      createdAt: nowLabel(),
      suggestions: aiQuickPrompts.slice(0, 4),
    },
  ];
}

export function runAiCommand(input: string, context: AiCommandContext): AiCommandResult {
  const text = normalize(input);
  const buyer = resolveBuyer(text, context.selectedBuyerId);
  const property = resolveProperty(text, context.selectedPropertyId);
  const area = resolveArea(text, property);

  if (includesAny(text, ["open", "go to", "show"]) && includesAny(text, ["broker workspace", "crm", "matching", "reports", "market", "intelligence", "connect", "billing", "admin"])) {
    const targetModule = moduleFromText(text);
    return result("open_module", "High", `I can open ${targetModule} for you.`, [], [
      action("open_module", `Open ${targetModule}`, "Navigate to the right Aurest module without changing data.", targetModule, { targetModule }),
    ], ["Find best matches for Sarah", "Generate a report"]);
  }

  if (includesAny(text, ["create buyer", "new buyer", "add buyer", "buyer for"])) {
    const name = extractName(input) || "New buyer";
    const budget = extractBudget(input) || 3_000_000;
    const inferredArea = area || "Dubai Marina";
    return result("create_buyer", "High", `I prepared a new buyer profile preview for ${name}. Confirm before I add it to the local demo workspace.`, [], [
      action("create_buyer", `Create buyer · ${name}`, `Budget AED ${money.format(budget)} · preferred area ${inferredArea}.`, "Buyer CRM", { name, budget, area: inferredArea, workspaceId: context.workspace.id }),
      action("open_module", "Open Buyer CRM", "Review or edit buyer records in the full CRM workflow.", "Buyer CRM", { targetModule: "Buyer CRM" }),
    ], ["Find matches for this buyer", "Generate buyer brief"]);
  }

  if (includesAny(text, ["match", "matches", "recommend", "best properties", "best property", "find"])) {
    const matches = rankForBuyer(buyer);
    const lead = matches[0];
    return result("find_matches", buyer ? "High" : "Medium", `${buyer ? buyer.name : "The selected buyer"} has ${matches.length} strong local demo matches. Top option: ${lead.property.title} at ${lead.match.score}% buyer fit.`, buyer ? [] : ["buyer"], [
      action("show_matches", `Show ${buyer?.name ?? "buyer"} matches`, `${lead.property.title} leads with ${lead.match.score}% fit and ${lead.match.dealScore} deal score.`, "Property Matching", { buyerId: buyer?.id ?? "", propertyId: lead.property.id, score: lead.match.score }),
      action("create_shortlist", "Create shortlist from top matches", "Save the top 3 properties into a buyer shortlist preview.", "Shortlists", { buyerId: buyer?.id ?? "", propertyCount: 3 }),
      action("open_module", "Open matching workspace", "Review scoring, reasons, and mismatches.", "Property Matching", { targetModule: "Property Matching" }),
    ], ["Generate WhatsApp pitch for the best property", "Create comparison report"]);
  }

  if (includesAny(text, ["brief", "summary", "persona", "buyer brief"])) {
    const summary = generateBuyerSummary(buyer);
    const persona = classifyBuyer(buyer);
    return result("generate_buyer_brief", "High", `Buyer brief ready for ${buyer.name}: ${persona.persona}. ${summary.salesAngle}`, [], [
      action("save_brief", `Save AI brief · ${buyer.name}`, `${summary.motivation} Suggested areas: ${summary.suggestedAreas}.`, "Buyer CRM", { buyerId: buyer.id, persona: persona.persona }),
      action("create_report", "Insert brief into report", "Use the brief as report context for the buyer.", "Reports", { buyerId: buyer.id }),
    ], ["Find matching properties", "Create report"]);
  }

  if (includesAny(text, ["whatsapp", "pitch", "message", "send message"])) {
    const lead = property ?? rankForBuyer(buyer)[0].property;
    const pitch = generateWhatsAppMessage("First recommendation", buyer, lead, "Short WhatsApp", "English");
    return result("generate_whatsapp_pitch", "High", `I drafted a WhatsApp pitch for ${buyer.name} about ${lead.title}.`, [], [
      action("copy_pitch", `Copy WhatsApp pitch · ${buyer.name}`, pitch, "WhatsApp Pitch", { buyerId: buyer.id, propertyId: lead.id }),
      action("open_module", "Open Sales Copilot", "Regenerate tone/language or save to local history.", "WhatsApp Pitch", { targetModule: "WhatsApp Pitch" }),
    ], ["Create follow-up sequence", "Create report"]);
  }

  if (includesAny(text, ["report", "comparison", "pdf", "client report"])) {
    const lead = property ?? rankForBuyer(buyer)[0].property;
    const multi = includesAny(text, ["comparison", "compare", "multiple"]);
    return result("generate_report", "High", `I can prepare a ${multi ? "comparison" : "buyer"} report for ${buyer.name}.`, [], [
      action("create_report", multi ? "Create comparison report" : "Create buyer report", `${buyer.name} · ${lead.title}${multi ? " plus top alternatives" : ""}.`, "Reports", { buyerId: buyer.id, propertyId: lead.id, comparison: multi }),
      action("open_module", "Open Report Studio", "Edit sections, branding, and PDF/public link options.", "Reports", { targetModule: "Reports" }),
    ], ["Generate WhatsApp summary", "Explain market for this report"]);
  }

  if (includesAny(text, ["follow-up", "follow up", "reminder", "tomorrow"])) {
    const lead = property ?? rankForBuyer(buyer)[0].property;
    const followUps = generateFollowUps(buyer, lead, "Friendly", "English", 3);
    return result("create_follow_up", "High", `I prepared ${followUps.length} follow-up reminders/messages for ${buyer.name}.`, [], [
      action("create_follow_up", `Add follow-up · ${buyer.name}`, followUps[0].text, "Deal Pipeline", { buyerId: buyer.id, propertyId: lead.id, due: text.includes("tomorrow") ? "Tomorrow" : "Today" }),
      action("open_module", "Open follow-ups", "Review reminders in Broker Workspace.", "Deal Pipeline", { targetModule: "Deal Pipeline" }),
    ], ["Generate WhatsApp follow-up", "Mark follow-up done"]);
  }

  if (includesAny(text, ["viewing", "schedule", "appointment", "visit"])) {
    const lead = property ?? rankForBuyer(buyer)[0].property;
    return result("schedule_viewing", "Medium", `I prepared a viewing placeholder for ${buyer.name} at ${lead.title}.`, [], [
      action("schedule_viewing", `Schedule viewing · ${lead.title}`, "Creates a local viewing placeholder; no calendar invite is sent.", "Deal Pipeline", { buyerId: buyer.id, propertyId: lead.id, date: "Tomorrow 10:30" }),
      action("open_module", "Open viewing tracker", "Review viewing status and feedback.", "Deal Pipeline", { targetModule: "Deal Pipeline" }),
    ], ["Generate viewing reminder", "Create call script"]);
  }

  if (includesAny(text, ["market", "community", "area", "dubai hills", "marina", "benchmark", "explain"])) {
    const lead = property ?? propertyForArea(area) ?? initialProperties[0];
    const explanation = generateMarketExplanation(lead);
    const benchmark = getAreaBenchmark(lead);
    return result("summarize_market", "High", `${explanation.title}: ${explanation.body}`, [], [
      action("include_market_summary", `Include ${benchmark.neighbourhood} market summary`, `Benchmark AED/m² ${money.format(benchmark.medianAedPerM2)} · sample ${benchmark.sampleSize}.`, "Market Benchmarks", { area: benchmark.neighbourhood, sampleSize: benchmark.sampleSize }),
      action("open_module", "Open Market Intelligence", "Review benchmarks, yield, POIs, heatmaps, and neighbourhood fit.", "Market Benchmarks", { targetModule: "Market Benchmarks" }),
    ], ["Create report with this market note", "Find undervalued deals"]);
  }

  return result("unknown", "Low", "I can help with buyers, matching, shortlists, pitches, reports, follow-ups, viewings, market summaries, and opening modules. Try one of the prompts below.", ["supported command"], [], aiQuickPrompts.slice(0, 5));
}

export function confirmAiAction(actionCard: AiActionCard): AiActionHistoryItem {
  return {
    id: `hist_${Date.now()}_${actionCard.id}`,
    actionId: actionCard.id,
    actionType: actionCard.type,
    title: actionCard.title,
    targetModule: actionCard.targetModule,
    summary: actionCard.description,
    confirmedAt: nowLabel(),
  };
}

export function actionConfirmationMessage(actionCard: AiActionCard) {
  if (actionCard.type === "open_module") return `Opened ${actionCard.targetModule}`;
  if (actionCard.type === "copy_pitch") return "WhatsApp pitch copied from AI preview";
  if (actionCard.type === "create_buyer") return "Buyer profile created in local AI demo state";
  if (actionCard.type === "create_report") return "Report generation opened from AI action";
  if (actionCard.type === "create_follow_up") return "Follow-up reminder added to local AI history";
  if (actionCard.type === "schedule_viewing") return "Viewing placeholder added to local AI history";
  return `${actionCard.title} confirmed`;
}

function result(intent: AiCommandIntent, confidence: AiCommandResult["confidence"], assistantMessage: string, requiredContext: string[], actions: AiActionCard[], suggestions: string[]): AiCommandResult {
  return { intent, confidence, assistantMessage, requiredContext, actions, suggestions };
}

function action(type: AiActionType, title: string, description: string, targetModule: string, payload: AiActionCard["payload"]): AiActionCard {
  return { id: `act_${type}_${Math.random().toString(36).slice(2, 8)}`, type, title, description, targetModule, payload, requiresConfirmation: true, status: "preview" };
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function resolveBuyer(text: string, selectedBuyerId?: string): BuyerProfile {
  return initialBuyerProfiles.find((buyer) => text.includes(buyer.name.toLowerCase().split(" ")[0])) ?? initialBuyerProfiles.find((buyer) => buyer.id === selectedBuyerId) ?? initialBuyerProfiles[0];
}

function resolveProperty(text: string, selectedPropertyId?: string): PropertyRecord | undefined {
  return initialProperties.find((property) => text.includes(property.title.toLowerCase().split(" ")[0]) || text.includes(property.neighbourhood.toLowerCase())) ?? initialProperties.find((property) => property.id === selectedPropertyId);
}

function resolveArea(text: string, property?: PropertyRecord) {
  const areas = ["Dubai Marina", "Dubai Hills", "Dubai Creek Harbour", "Downtown Dubai", "Business Bay", "JVC", "Palm Jumeirah"];
  return areas.find((area) => text.includes(area.toLowerCase())) ?? property?.neighbourhood ?? "";
}

function propertyForArea(area: string) {
  return initialProperties.find((property) => property.neighbourhood === area);
}

function rankForBuyer(buyer: BuyerProfile) {
  return initialProperties.map((property) => ({ property, match: scoreBuyerProperty(buyer, property) })).sort((a, b) => b.match.score - a.match.score);
}

function extractBudget(input: string) {
  const lower = input.toLowerCase();
  const million = lower.match(/(\d+(?:\.\d+)?)\s*(m|million)/);
  if (million) return Number(million[1]) * 1_000_000;
  const aed = lower.match(/aed\s*([\d,.]+)/);
  if (aed) return Number(aed[1].replace(/,/g, ""));
  return 0;
}

function extractName(input: string) {
  const match = input.match(/(?:for|buyer)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  return match?.[1];
}

function moduleFromText(text: string) {
  if (text.includes("crm") || text.includes("buyer")) return "Buyer CRM";
  if (text.includes("matching") || text.includes("match")) return "Property Matching";
  if (text.includes("report")) return "Reports";
  if (text.includes("market") || text.includes("intelligence")) return "Market Benchmarks";
  if (text.includes("connect")) return "Broker Network";
  if (text.includes("billing")) return "Billing";
  if (text.includes("admin")) return "Users & Roles";
  return "Broker Workspace";
}
