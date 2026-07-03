import { initialBuyerProfiles, type BuyerPersona } from "@/lib/buyer-data";
import { initialProperties, type PropertyRecord } from "@/lib/property-data";
import { initialReports, reportTemplates } from "@/lib/report-data";
import { getPriceHistory, priceMovement } from "@/lib/market-intel";

export type ConversionStage = "Report sent" | "Buyer opened report" | "Follow-up sent" | "Viewing booked" | "Deal won/lost";
export type QualityFactor = { label: string; passed: boolean; weight: number; detail: string };
export type DuplicateCandidate = { id: string; primary: PropertyRecord; duplicate: PropertyRecord; confidence: number; factors: string[]; status: "Needs review" | "Ignored" | "Merged later" };
export type Freshness = { score: number; label: "New" | "Fresh" | "Active" | "Stale" | "Unknown"; reasons: string[] };

const brokerRows = [
  { name: "Zied Machkena", buyers: 12, reports: 18, followUps: 21, activeBuyers: 9, won: 3, lost: 1, templates: "Investor report", messages: 44 },
  { name: "Maya Rahman", buyers: 9, reports: 14, followUps: 18, activeBuyers: 7, won: 2, lost: 2, templates: "Family relocation", messages: 31 },
  { name: "Rami Haddad", buyers: 7, reports: 11, followUps: 15, activeBuyers: 6, won: 1, lost: 1, templates: "Luxury buyer", messages: 26 },
  { name: "Noor Khan", buyers: 2, reports: 2, followUps: 4, activeBuyers: 1, won: 0, lost: 0, templates: "Short recommendation", messages: 7 },
];

export function soloBrokerMetrics() {
  const personas = count(initialBuyerProfiles.map((buyer) => buyer.persona));
  const areas = count(initialBuyerProfiles.flatMap((buyer) => buyer.preferredAreas));
  return {
    activeBuyers: initialBuyerProfiles.filter((buyer) => !["Lost", "On hold"].includes(buyer.status)).length,
    newBuyersThisMonth: 3,
    newPropertyMatches: 7,
    buyersCreated: initialBuyerProfiles.length,
    reportsGenerated: initialReports.length + 15,
    propertiesShortlisted: 14,
    followUpsCreated: 21,
    reportsThisMonth: 18,
    usageLimitRemaining: 12,
    recentActivities: [
      "Omar · report opened and WhatsApp pitch copied",
      "Sarah · viewing scheduled for Dubai Hills",
      "Lina · new Creek Harbour match detected",
      "James · relocation summary updated",
    ],
    nextActions: [
      "Follow up Omar today",
      "Send Sarah comparison report",
      "Review Lina off-plan search",
    ],
    topPersonas: Object.entries(personas).sort((a, b) => b[1] - a[1]).slice(0, 4) as [BuyerPersona, number][],
    topAreas: Object.entries(areas).sort((a, b) => b[1] - a[1]).slice(0, 5),
  };
}

export function teamUsageRows() {
  return brokerRows;
}

export function areaDemandRows() {
  return ["Dubai Marina", "Dubai Hills", "Downtown Dubai", "Dubai Creek Harbour", "JVC"].map((area, index) => ({
    area,
    requested: 42 - index * 6,
    recommended: 36 - index * 5,
    reported: 22 - index * 3,
    viewed: 18 - index * 2,
    persona: index === 0 ? "Rental yield investor" : index === 1 ? "End-user family buyer" : index === 2 ? "Relocation buyer" : "Capital appreciation investor",
    budget: index < 2 ? "AED 2M–5M" : "AED 1.2M–3M",
    propertyType: index === 1 ? "Villa / Townhouse" : "Apartment",
    bedrooms: index === 0 ? "2 bed" : index === 1 ? "3–4 bed" : "1–2 bed",
    purpose: index < 4 ? "Buy" : "Rent",
    lowSample: index >= 3,
  }));
}

export function conversionFunnel() {
  return [
    { stage: "Report sent" as ConversionStage, count: 38 },
    { stage: "Buyer opened report" as ConversionStage, count: 27 },
    { stage: "Follow-up sent" as ConversionStage, count: 22 },
    { stage: "Viewing booked" as ConversionStage, count: 11 },
    { stage: "Deal won/lost" as ConversionStage, count: 4 },
  ];
}

export function mostUsedTemplates() {
  return reportTemplates.slice(0, 5).map((template, index) => ({ name: template.name, count: 18 - index * 3 }));
}

export function dataQualityFactors(property: PropertyRecord): QualityFactor[] {
  return [
    { label: "Price exists", passed: property.price > 0, weight: 10, detail: property.price ? `AED ${property.price.toLocaleString()}` : "Missing" },
    { label: "Area exists", passed: property.areaSqFt > 0, weight: 8, detail: property.areaSqFt ? `${property.areaSqFt.toLocaleString()} sq ft` : "Missing" },
    { label: "Location exists", passed: Boolean(property.neighbourhood && property.latitude && property.longitude), weight: 10, detail: property.neighbourhood || "Missing area" },
    { label: "Images exist", passed: property.images.length > 0, weight: 8, detail: `${property.images.length} image(s)` },
    { label: "Cover image exists", passed: Boolean(property.images[0]), weight: 6, detail: property.images[0] ? "Cover ready" : "Missing cover" },
    { label: "Bedroom/bathroom data exists", passed: property.rooms >= 0 && property.baths !== null, weight: 8, detail: `${property.rooms || "Studio"} bed · ${property.baths ?? "—"} bath` },
    { label: "Description quality", passed: property.description.length > 80, weight: 10, detail: `${property.description.length} chars` },
    { label: "Amenities exist", passed: property.amenities.length >= 3, weight: 8, detail: `${property.amenities.length} amenities` },
    { label: "Agent contact exists", passed: Boolean(property.agent && property.agency), weight: 8, detail: property.agent || "Missing agent" },
    { label: "Verified flag", passed: property.verified, weight: 8, detail: property.verified ? "Verified" : "Not verified" },
    { label: "Payment plan available", passed: Boolean(property.paymentPlan), weight: 8, detail: property.paymentPlan || "Missing" },
    { label: "Developer/project data available", passed: Boolean(property.developer || property.building), weight: 8, detail: property.developer || property.building || "Missing" },
  ];
}

export function dataQualityScore(property: PropertyRecord) {
  const factors = dataQualityFactors(property);
  const total = factors.reduce((sum, factor) => sum + factor.weight, 0);
  const passed = factors.filter((factor) => factor.passed).reduce((sum, factor) => sum + factor.weight, 0);
  return Math.round((passed / total) * 100);
}

export function reportQualityWarnings(property: PropertyRecord) {
  return dataQualityFactors(property).filter((factor) => !factor.passed && factor.weight >= 10).map((factor) => factor.label);
}

export function duplicateCandidates(): DuplicateCandidate[] {
  const first = initialProperties[0];
  const synthetic: PropertyRecord = { ...first, id: "prop_dubizzle_synthetic_dup", source: "dubizzle", externalId: "DZ-DUP-9981", title: "Full Sea View Marina Vista 2BR", price: 2_720_000, areaSqFt: 1_142, agent: "Zied Machkena" };
  return [
    { id: "dup_1", primary: first, duplicate: synthetic, confidence: 91, factors: ["Same building", "Similar price", "Similar size", "Same bedrooms", "Title similarity", "Same agent"], status: "Needs review" },
    { id: "dup_2", primary: initialProperties[1], duplicate: { ...initialProperties[1], id: "prop_bayut_possible_dup", source: "bayut", externalId: "BY-POSS-441", price: 2_430_000, areaSqFt: 1_080, title: "Park Heights Boulevard 2 Bedroom" }, confidence: 78, factors: ["Same area", "Similar building", "Similar size", "Same bedrooms"], status: "Needs review" },
  ];
}

export function listingFreshness(property: PropertyRecord): Freshness {
  const history = getPriceHistory(property);
  const movement = priceMovement(history);
  const scrapedTime = new Date(property.scrapedAt).getTime();
  if (Number.isNaN(scrapedTime)) {
    return { score: 0, label: "Unknown", reasons: ["Scraped date is missing or invalid", "Freshness cannot be trusted until source timestamps are available"] };
  }
  const daysSinceScrape = Math.max(0, Math.round((new Date("2026-06-30").getTime() - scrapedTime) / 86_400_000));
  let score = 100 - Math.min(daysSinceScrape * 2.4, 55);
  if (!property.verified) score -= 14;
  if (movement.direction === "drop") score -= 5;
  if (movement.direction === "increase") score -= 3;
  if (property.source === "manual") score -= 8;
  score = Math.max(0, Math.min(100, score));
  const label: Freshness["label"] = daysSinceScrape <= 3 && score >= 70 ? "New" : score >= 78 ? "Fresh" : score >= 50 ? "Active" : "Stale";
  return {
    score,
    label,
    reasons: [
      `Last scraped ${daysSinceScrape} day(s) ago`,
      `Days active estimate: ${daysSinceScrape}`,
      movement.direction === "flat" ? "No price movement" : `${movement.percent}% price ${movement.direction}`,
      property.verified ? "Verified listing" : "Not verified",
      property.source === "manual" ? "Manual source needs periodic re-check" : `Seen on ${property.source}`,
    ],
  };
}

function count<T extends string>(items: T[]) {
  return items.reduce<Record<T, number>>((totals, item) => ({ ...totals, [item]: (totals[item] ?? 0) + 1 }), {} as Record<T, number>);
}
