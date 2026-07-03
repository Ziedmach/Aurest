import { initialBuyerProfiles } from "@/lib/buyer-data";
import { initialProperties } from "@/lib/property-data";
import { initialReports } from "@/lib/report-data";

export type ExportType = "Buyer profiles" | "Report history" | "Property shortlists" | "Saved searches" | "Usage data" | "Team activity";
export type WebhookEvent = "Buyer created" | "Report generated" | "Property shortlisted" | "Buyer status changed";
export type PortalSource = "Property Finder" | "Bayut" | "Dubizzle" | "Agency inventory" | "Manual CSV" | "PDF brochures";

export type PlanId = "solo" | "broker-pro" | "team" | "agency" | "enterprise";
export type PlanLimitKey = "users" | "reports" | "buyerProfiles" | "aiGenerations" | "savedSearches" | "exports" | "publicLinks" | "pdfExports" | "dataImports";
export type PlanFeatureKey = "exports" | "dld" | "teamAnalytics" | "templates";
export type PlanPackage = { id: PlanId; name: string; price: string; audience: string; includes: string[]; limits: Record<PlanLimitKey, number>; features: Record<PlanFeatureKey, boolean> };
export type UsageSnapshot = Record<PlanLimitKey, number>;

export const exportTypes: ExportType[] = ["Buyer profiles", "Report history", "Property shortlists", "Saved searches", "Usage data", "Team activity"];
export const webhookEvents: WebhookEvent[] = ["Buyer created", "Report generated", "Property shortlisted", "Buyer status changed"];
export const portalSources: PortalSource[] = ["Property Finder", "Bayut", "Dubizzle", "Agency inventory", "Manual CSV", "PDF brochures"];

export const planPackages: PlanPackage[] = [
  { id: "solo", name: "Solo Broker", price: "AED 299–599/mo", audience: "Independent Broker", includes: ["1 user", "Personal branding", "Buyer profiles", "Property matching", "AI property reports", "WhatsApp/email generator", "Limited monthly reports", "PDF export"], limits: { users: 1, reports: 30, buyerProfiles: 50, aiGenerations: 150, savedSearches: 15, exports: 10, publicLinks: 5, pdfExports: 20, dataImports: 10 }, features: { exports: true, dld: false, teamAnalytics: false, templates: false } },
  { id: "broker-pro", name: "Broker Pro", price: "AED 799–1,200/mo", audience: "Independent Broker", includes: ["More reports", "Multi-property comparison", "DLD comparables", "Rental yield estimate", "Deal score", "Follow-up sequences", "Investor report template", "Public report links"], limits: { users: 1, reports: 90, buyerProfiles: 150, aiGenerations: 500, savedSearches: 50, exports: 40, publicLinks: 25, pdfExports: 80, dataImports: 35 }, features: { exports: true, dld: true, teamAnalytics: false, templates: true } },
  { id: "team", name: "Team", price: "AED 1,500–4,500/mo", audience: "Small Teams", includes: ["3–10 users", "Shared listings", "Shared templates", "Team branding", "Buyer assignment", "Team dashboard", "Report library"], limits: { users: 10, reports: 250, buyerProfiles: 500, aiGenerations: 1200, savedSearches: 150, exports: 100, publicLinks: 75, pdfExports: 220, dataImports: 120 }, features: { exports: true, dld: true, teamAnalytics: true, templates: true } },
  { id: "agency", name: "Agency", price: "AED 5,000–15,000/mo", audience: "Agencies", includes: ["Multiple users", "Agency branding", "Admin dashboard", "Team analytics", "Report templates", "Shared property database", "Data exports", "CRM export later"], limits: { users: 100, reports: 1000, buyerProfiles: 3000, aiGenerations: 5000, savedSearches: 600, exports: 500, publicLinks: 300, pdfExports: 900, dataImports: 500 }, features: { exports: true, dld: true, teamAnalytics: true, templates: true } },
  { id: "enterprise", name: "Enterprise", price: "Custom", audience: "Large Agencies", includes: ["Custom users", "Custom report volume", "Dedicated onboarding", "Advanced exports", "Priority support", "Custom templates", "Admin-managed limits"], limits: { users: 500, reports: 10000, buyerProfiles: 25000, aiGenerations: 50000, savedSearches: 5000, exports: 5000, publicLinks: 5000, pdfExports: 8000, dataImports: 5000 }, features: { exports: true, dld: true, teamAnalytics: true, templates: true } },
];

export const currentUsage: UsageSnapshot = { users: 1, reports: 18, buyerProfiles: 12, aiGenerations: 76, savedSearches: 7, exports: 3, publicLinks: 2, pdfExports: 9, dataImports: 4 };

export const platformWorkspaces = [
  { id: "ws_zied_properties", name: "Zied Properties", plan: "Solo Broker", status: "Active", users: 1, reports: 18, imports: 4, errors: 0, supportFlag: "None" },
  { id: "ws_marina_team", name: "Marina Advisory Team", plan: "Team", status: "Active", users: 7, reports: 146, imports: 38, errors: 2, supportFlag: "Import review" },
  { id: "ws_prime_agency", name: "Prime Dubai Agency", plan: "Agency", status: "Active", users: 42, reports: 613, imports: 141, errors: 5, supportFlag: "Prompt audit" },
  { id: "ws_paused_demo", name: "Paused Demo Workspace", plan: "Broker Pro", status: "Disabled", users: 1, reports: 4, imports: 2, errors: 1, supportFlag: "Billing hold" },
];

export const importErrorRecords = [
  { id: "imp_err_1", importId: "imp_2406_bayut", row: 17, source: "Bayut", externalId: "BY-BAD-1", reason: "Missing or invalid price", status: "Needs review", createdAt: "24 Jun 2026 · 09:55" },
  { id: "imp_err_2", importId: "imp_2406_bayut", row: 29, source: "Bayut", externalId: "BY-NO-LOC", reason: "Missing neighbourhood/building", status: "Needs review", createdAt: "24 Jun 2026 · 09:55" },
  { id: "imp_err_3", importId: "imp_2306_csv", row: 8, source: "Manual CSV", externalId: "CSV-008", reason: "Duplicate external ID with conflicting source", status: "Ignored", createdAt: "23 Jun 2026 · 16:20" },
];

export const promptVersions = [
  { id: "prompt_report_v3_2", name: "Report generator", version: "v3.2", status: "Active", updatedAt: "24 Jun 2026" },
  { id: "prompt_sales_v2_1", name: "Sales copilot", version: "v2.1", status: "Active", updatedAt: "22 Jun 2026" },
  { id: "prompt_guardrails_v1_4", name: "Compliance guardrails", version: "v1.4", status: "Review", updatedAt: "20 Jun 2026" },
];

export const featureLabels: Record<PlanFeatureKey, string> = {
  exports: "Export availability",
  dld: "DLD feature access",
  teamAnalytics: "Team analytics access",
  templates: "Template access",
};

export function planFromWorkspacePlan(planName: string) {
  const normalized = planName.toLowerCase();
  if (normalized.includes("enterprise")) return planPackages.find((plan) => plan.id === "enterprise")!;
  if (normalized.includes("agency")) return planPackages.find((plan) => plan.id === "agency")!;
  if (normalized.includes("team")) return planPackages.find((plan) => plan.id === "team")!;
  if (normalized.includes("broker pro") || normalized.includes("solo pro")) return planPackages.find((plan) => plan.id === "broker-pro")!;
  return planPackages.find((plan) => plan.id === "solo")!;
}

export function remainingUsage(plan: PlanPackage, usage: UsageSnapshot, key: PlanLimitKey) {
  return Math.max(0, plan.limits[key] - usage[key]);
}

export function isLimitReached(plan: PlanPackage, usage: UsageSnapshot, key: PlanLimitKey) {
  return usage[key] >= plan.limits[key];
}

export function buildCsvPreview(type: ExportType) {
  if (type === "Buyer profiles") return ["id,name,email,persona,status", ...initialBuyerProfiles.slice(0, 3).map((buyer) => `${buyer.id},${buyer.name},${buyer.email},${buyer.persona},${buyer.status}`)].join("\n");
  if (type === "Report history") return ["id,title,buyer,status,views,created_by", ...initialReports.map((report) => `${report.id},${report.title},${report.buyerName},${report.status},${report.publicLink.views},${report.createdBy}`)].join("\n");
  if (type === "Property shortlists") return ["property_id,title,area,price,source", ...initialProperties.slice(0, 3).map((property) => `${property.id},${property.title},${property.neighbourhood},${property.price},${property.source}`)].join("\n");
  if (type === "Saved searches") return "id,name,buyer,alerts_enabled,last_run\nss_omar,Omar Marina yield,buy_omar,true,2026-06-24\nss_sarah,Sarah family options,buy_sarah,true,2026-06-23";
  if (type === "Team activity") return "user,role,buyers_created,reports_generated,followups,period\nZied,Owner,12,18,21,this_month\nMaya,Manager,9,14,18,this_month";
  return "metric,used,limit\nreports,18,30\nai_generations,76,150\nexports,3,10\npdf_exports,9,20\ndata_imports,4,10";
}

export function brochureExtractionSample() {
  return {
    projectName: "Harbour Gate Residences",
    developer: "Emaar",
    location: "Dubai Creek Harbour",
    unitTypes: "1, 2 and 3-bedroom apartments",
    startingPrice: "From AED 1.95M",
    paymentPlan: "20% booking · 40% construction · 40% handover",
    handoverDate: "Q4 2027",
    completionStatus: "Off-plan",
    amenities: "Pool, gym, promenade, kids area, concierge",
    nearbyLandmarks: "Creek Marina, Ras Al Khor Wildlife Sanctuary, Downtown Dubai access",
    keySellingPoints: "Waterfront master community, Emaar track record, skyline views, staged payment plan",
    floorPlanDetails: "3 floor plan pages detected · 1BR 720 sq ft · 2BR 1,045 sq ft · 3BR 1,520 sq ft",
    contactDetails: "Emaar sales centre · +971 4 000 0000",
  };
}

export function extractionConfidence() {
  return {
    projectName: 96,
    developer: 92,
    location: 88,
    unitTypes: 84,
    startingPrice: 91,
    paymentPlan: 73,
    handoverDate: 68,
    completionStatus: 82,
    amenities: 79,
    nearbyLandmarks: 61,
    keySellingPoints: 76,
    floorPlanDetails: 57,
    contactDetails: 49,
  };
}
