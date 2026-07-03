export type PromptType =
  | "Buyer persona"
  | "Buyer needs summary"
  | "Property match explanation"
  | "Single property report"
  | "Multi-property report"
  | "WhatsApp message"
  | "Email"
  | "Call script"
  | "Follow-up"
  | "Objection handling"
  | "Neighbourhood summary"
  | "Investment analysis";

export type PromptVersion = {
  id: string;
  version: string;
  body: string;
  createdAt: string;
  createdBy: string;
  note: string;
};

export type PromptTemplate = {
  id: string;
  type: PromptType;
  title: string;
  description: string;
  activeVersion: string;
  updatedAt: string;
  locked: boolean;
  testSample: string;
  versions: PromptVersion[];
};

export type PromptAuditLog = {
  id: string;
  action: "Edited" | "Tested" | "Restored";
  promptId: string;
  promptTitle: string;
  user: string;
  date: string;
  detail: string;
};

export const promptTypes: PromptType[] = [
  "Buyer persona",
  "Buyer needs summary",
  "Property match explanation",
  "Single property report",
  "Multi-property report",
  "WhatsApp message",
  "Email",
  "Call script",
  "Follow-up",
  "Objection handling",
  "Neighbourhood summary",
  "Investment analysis",
];

const basePrompt = (type: PromptType) => `You are Dubai Property Intel. Generate ${type.toLowerCase()} content using only provided buyer, property, workspace and market context. Keep assumptions visible, avoid guarantees, avoid sensitive profiling, and produce broker-editable output.`;

export const initialPromptTemplates: PromptTemplate[] = promptTypes.map((type, index) => ({
  id: `prompt_${type.toLowerCase().replaceAll(" ", "_").replaceAll("/", "_")}`,
  type,
  title: `${type} prompt`,
  description: descriptionForPrompt(type),
  activeVersion: `v1.${index % 4 + 1}`,
  updatedAt: `${24 - index % 5} Jun 2026`,
  locked: ["Single property report", "Multi-property report", "Investment analysis"].includes(type),
  testSample: sampleForPrompt(type),
  versions: [
    { id: `ver_${index}_current`, version: `v1.${index % 4 + 1}`, body: basePrompt(type), createdAt: `${24 - index % 5} Jun 2026`, createdBy: "Platform Owner", note: "Active production prompt" },
    { id: `ver_${index}_previous`, version: `v1.${index % 4}`, body: `${basePrompt(type)}\n\nPrevious style: shorter output, fewer compliance reminders.`, createdAt: `${18 - index % 4} Jun 2026`, createdBy: "Platform Owner", note: "Previous stable version" },
  ],
}));

export const initialPromptAuditLogs: PromptAuditLog[] = [
  { id: "prompt_log_1", action: "Edited", promptId: "prompt_single_property_report", promptTitle: "Single property report prompt", user: "Platform Owner", date: "24 Jun 2026 · 11:05", detail: "Added data freshness and no-guarantee guardrail" },
  { id: "prompt_log_2", action: "Tested", promptId: "prompt_whatsapp_message", promptTitle: "WhatsApp message prompt", user: "Platform Owner", date: "23 Jun 2026 · 17:20", detail: "Tested on Omar + Marina Vista sample" },
  { id: "prompt_log_3", action: "Restored", promptId: "prompt_buyer_persona", promptTitle: "Buyer persona prompt", user: "Platform Owner", date: "22 Jun 2026 · 13:42", detail: "Restored v1.0 after tone regression" },
];

export function runPromptTest(template: PromptTemplate, sample: string) {
  const short = sample.length > 90 ? `${sample.slice(0, 90)}…` : sample;
  return `Test result for ${template.title}\n\nSample: ${short}\n\nOutput preview:\n- Uses provided buyer/property context only.\n- Applies ${template.type.toLowerCase()} structure.\n- Includes assumptions and compliance guardrails.\n- Ready for broker review before client sharing.`;
}

function descriptionForPrompt(type: PromptType) {
  if (type.includes("report")) return "Controls report structure, evidence, tone, disclaimers and editable advisory output.";
  if (["WhatsApp message", "Email", "Call script", "Follow-up", "Objection handling"].includes(type)) return "Controls Sales Copilot messaging style, brevity, buyer context and no-guarantee language.";
  if (type.includes("Investment")) return "Controls return, yield, benchmark and risk framing for investor-facing analysis.";
  return "Controls buyer intelligence and recommendation explanation output.";
}

function sampleForPrompt(type: PromptType) {
  if (type.includes("report")) return "Buyer: Omar, rental yield investor. Property: Marina Vista 2BR, AED 2.75M, Dubai Marina, 6.4% indicative yield.";
  if (type === "Objection handling") return "Buyer objection: price is too high. Buyer budget: AED 2M–3.2M. Property: Marina Vista, strong yield but needs benchmark validation.";
  if (type === "Neighbourhood summary") return "Area: Dubai Hills. Buyer persona: family relocation buyer. Needs: schools, parks, commute, daily convenience.";
  return "Buyer: Sarah, family buyer. Budget: AED 3.5M–5M. Areas: Dubai Hills. Needs: schools, commute, family lifestyle.";
}
