export type PropertySource = "bayut" | "dubizzle" | "manual";

export type PropertyRecord = {
  id: string;
  source: PropertySource;
  externalId: string;
  title: string;
  price: number;
  currency: string;
  purpose: "buy" | "rent";
  propertyType: string;
  rooms: number;
  baths: number | null;
  areaSqFt: number;
  plotAreaSqFt: number | null;
  city: string;
  neighbourhood: string;
  building: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  description: string;
  amenities: string[];
  agent: string;
  agency: string;
  developer: string;
  completionStatus: string;
  furnishing: string;
  paymentPlan: string;
  scrapedAt: string;
  verified: boolean;
  estimatedYield: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ImportFailure = { row: number; externalId: string; reason: string };
export type ImportResult = { source: PropertySource; detectedLabel: string; records: PropertyRecord[]; failures: ImportFailure[] };

const photos = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
];

export const initialProperties: PropertyRecord[] = [
  makeProperty({ id: "prop_bayut_983410", source: "bayut", externalId: "BY-983410", title: "Marina Vista · Full Sea View", price: 2750000, neighbourhood: "Dubai Marina", building: "Marina Vista", developer: "Emaar", areaSqFt: 1148, rooms: 2, baths: 3, estimatedYield: 6.4, images: [photos[0], photos[1]], amenities: ["Pool", "Gym", "Concierge", "Balcony", "Covered parking"] }),
  makeProperty({ id: "prop_dubizzle_72411", source: "dubizzle", externalId: "DZ-72411", title: "Park Heights · Boulevard View", price: 2390000, neighbourhood: "Dubai Hills", building: "Park Heights", developer: "Emaar", areaSqFt: 1067, rooms: 2, baths: 2, estimatedYield: 5.8, images: [photos[1], photos[3]], amenities: ["Pool", "Gym", "Park access", "Security"] }),
  makeProperty({ id: "prop_bayut_55109", source: "bayut", externalId: "BY-55109", title: "Creek Palace · Skyline Residence", price: 2150000, neighbourhood: "Dubai Creek Harbour", building: "Creek Palace", developer: "Emaar", areaSqFt: 1012, rooms: 2, baths: 2, estimatedYield: 6.8, images: [photos[2]], amenities: ["Creek view", "Pool", "Gym", "Kids area"] }),
  makeProperty({ id: "prop_dubizzle_88220", source: "dubizzle", externalId: "DZ-88220", title: "Downtown Address · Furnished Studio", price: 145000, purpose: "rent", neighbourhood: "Downtown Dubai", building: "Address Residences", developer: "Emaar", areaSqFt: 610, rooms: 0, baths: 1, furnishing: "Furnished", images: [photos[3]], amenities: ["Hotel services", "Pool", "Burj Khalifa view"] }),
];

function makeProperty(overrides: Partial<PropertyRecord>): PropertyRecord {
  const now = "2026-06-24T08:00:00.000Z";
  return {
    id: "prop_demo", source: "manual", externalId: "MAN-001", title: "Dubai residence", price: 2000000, currency: "AED", purpose: "buy", propertyType: "Apartment", rooms: 2, baths: 2, areaSqFt: 1000, plotAreaSqFt: null, city: "Dubai", neighbourhood: "Dubai Marina", building: "", latitude: 25.08, longitude: 55.14, images: [photos[0]], description: "Well-positioned residence with strong access to community amenities and transport.", amenities: [], agent: "Zied Machkena", agency: "Zied Properties", developer: "", completionStatus: "Ready", furnishing: "Unfurnished", paymentPlan: "Not applicable", scrapedAt: now, verified: true, estimatedYield: null, createdAt: now, updatedAt: now, ...overrides,
  };
}

const asString = (value: unknown, fallback = "") => typeof value === "string" || typeof value === "number" ? String(value) : fallback;
const asNumber = (value: unknown, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const asList = (value: unknown) => Array.isArray(value) ? value.map((item) => asString(typeof item === "object" && item ? (item as Record<string, unknown>).url ?? (item as Record<string, unknown>).name : item)).filter(Boolean) : [];
const nested = (object: Record<string, unknown>, path: string) => path.split(".").reduce<unknown>((value, key) => typeof value === "object" && value ? (value as Record<string, unknown>)[key] : undefined, object);

export function detectPortal(input: unknown): PropertySource | null {
  const rows = extractRows(input);
  const sample = rows[0] ?? {};
  if ("bayut_id" in sample || "externalID" in sample || "coverPhoto" in sample || "isVerified" in sample) return "bayut";
  if ("dubizzle_id" in sample || "listing_id" in sample || "photos" in sample || "furnished" in sample) return "dubizzle";
  return null;
}

export function extractRows(input: unknown): Record<string, unknown>[] {
  if (Array.isArray(input)) return input.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
  if (input && typeof input === "object") {
    const object = input as Record<string, unknown>;
    for (const key of ["listings", "results", "properties", "data"]) if (Array.isArray(object[key])) return extractRows(object[key]);
    return [object];
  }
  return [];
}

export function normalizePortalJson(input: unknown, forcedSource?: PropertySource): ImportResult {
  const rows = extractRows(input);
  const detected = forcedSource ?? detectPortal(input) ?? "manual";
  const failures: ImportFailure[] = [];
  const records = rows.flatMap((raw, index) => {
    try {
      const record = detected === "bayut" ? normalizeBayut(raw, index) : detected === "dubizzle" ? normalizeDubizzle(raw, index) : normalizeManual(raw, index);
      if (!record.externalId) throw new Error("Missing external ID");
      if (!record.title && !record.neighbourhood) throw new Error("Missing title and location");
      if (!record.price) throw new Error("Missing or invalid price");
      return [record];
    } catch (error) {
      failures.push({ row: index + 1, externalId: asString(raw.externalID ?? raw.listing_id ?? raw.id, "Unknown"), reason: error instanceof Error ? error.message : "Invalid record" });
      return [];
    }
  });
  return { source: detected, detectedLabel: detected === "bayut" ? "Bayut JSON" : detected === "dubizzle" ? "Dubizzle JSON" : "Generic / manual JSON", records, failures };
}

function normalizeBayut(raw: Record<string, unknown>, index: number): PropertyRecord {
  const externalId = asString(raw.externalID ?? raw.bayut_id ?? raw.id);
  const location = asString(nested(raw, "location.name") ?? raw.location ?? raw.neighbourhood);
  return makeProperty({ id: `prop_bayut_${externalId || index}`, source: "bayut", externalId, title: asString(raw.title), price: asNumber(raw.price), currency: asString(raw.currency, "AED"), purpose: asString(raw.purpose).toLowerCase().includes("rent") ? "rent" : "buy", propertyType: asString(raw.category ?? raw.propertyType, "Apartment"), rooms: asNumber(raw.rooms ?? raw.beds), baths: raw.baths == null ? null : asNumber(raw.baths), areaSqFt: asNumber(raw.area ?? nested(raw, "area.value")), plotAreaSqFt: raw.plotArea == null ? null : asNumber(raw.plotArea), city: asString(raw.city, "Dubai"), neighbourhood: location, building: asString(raw.building), latitude: raw.latitude == null ? null : asNumber(raw.latitude), longitude: raw.longitude == null ? null : asNumber(raw.longitude), images: asList(raw.photos ?? raw.images ?? [nested(raw, "coverPhoto.url")]), description: asString(raw.description), amenities: asList(raw.amenities), agent: asString(nested(raw, "contactName") ?? nested(raw, "agent.name") ?? raw.agent), agency: asString(nested(raw, "agency.name") ?? raw.agency), developer: asString(raw.developer), completionStatus: asString(raw.completionStatus, "Ready"), paymentPlan: asString(raw.paymentPlan, "Not provided"), scrapedAt: asString(raw.scraped_date ?? raw.scrapedAt, new Date().toISOString()), verified: Boolean(raw.isVerified ?? raw.verified), furnishing: asString(raw.furnishingStatus ?? raw.furnishing, "Not specified"), updatedAt: new Date().toISOString() });
}

function normalizeDubizzle(raw: Record<string, unknown>, index: number): PropertyRecord {
  const externalId = asString(raw.listing_id ?? raw.dubizzle_id ?? raw.id);
  return makeProperty({ id: `prop_dubizzle_${externalId || index}`, source: "dubizzle", externalId, title: asString(raw.name ?? raw.title), price: asNumber(raw.price ?? raw.amount), currency: asString(raw.currency, "AED"), purpose: asString(raw.usage ?? raw.purpose).toLowerCase().includes("rent") ? "rent" : "buy", propertyType: asString(raw.type ?? raw.property_type, "Apartment"), rooms: asNumber(raw.bedrooms ?? raw.rooms), baths: raw.bathrooms == null ? null : asNumber(raw.bathrooms), areaSqFt: asNumber(raw.size ?? raw.area), plotAreaSqFt: raw.plot_size == null ? null : asNumber(raw.plot_size), city: asString(raw.city, "Dubai"), neighbourhood: asString(raw.neighbourhood ?? raw.community ?? nested(raw, "location.name")), building: asString(raw.building_name ?? raw.building), latitude: raw.lat == null ? null : asNumber(raw.lat), longitude: raw.lng == null ? null : asNumber(raw.lng), images: asList(raw.photos ?? raw.images), description: asString(raw.description), amenities: asList(raw.amenities ?? raw.features), agent: asString(raw.agent_name ?? raw.agent), agency: asString(raw.agency_name ?? raw.agency), developer: asString(raw.developer), completionStatus: asString(raw.completion_status, "Ready"), paymentPlan: asString(raw.payment_plan, "Not provided"), scrapedAt: asString(raw.scraped_date ?? raw.created_at, new Date().toISOString()), verified: Boolean(raw.verified), furnishing: asString(raw.furnished ?? raw.furnishing, "Not specified"), updatedAt: new Date().toISOString() });
}

function normalizeManual(raw: Record<string, unknown>, index: number): PropertyRecord {
  return makeProperty({ id: `prop_manual_${asString(raw.externalId ?? raw.id, String(index))}`, source: "manual", externalId: asString(raw.externalId ?? raw.id), title: asString(raw.title), price: asNumber(raw.price), neighbourhood: asString(raw.neighbourhood), building: asString(raw.building), rooms: asNumber(raw.rooms ?? raw.bedrooms), baths: raw.baths == null ? null : asNumber(raw.baths), areaSqFt: asNumber(raw.area ?? raw.areaSqFt), images: asList(raw.images), description: asString(raw.description), amenities: asList(raw.amenities), updatedAt: new Date().toISOString() });
}

export const sampleBayutJson = { listings: [{ externalID: "BY-983410", title: "Marina Vista · Updated Sea View", price: 2725000, currency: "AED", purpose: "for-sale", category: "Apartment", rooms: 2, baths: 3, area: 1148, city: "Dubai", location: { name: "Dubai Marina" }, building: "Marina Vista", latitude: 25.082, longitude: 55.141, coverPhoto: { url: photos[0] }, amenities: ["Pool", "Gym", "Concierge"], agent: { name: "Zied Machkena" }, agency: { name: "Zied Properties" }, isVerified: true, scraped_date: "2026-06-24T10:00:00Z" }, { externalID: "BY-NEW-777", title: "Harbour Gate · New Listing", price: 1950000, purpose: "for-sale", category: "Apartment", rooms: 2, baths: 2, area: 1045, location: { name: "Dubai Creek Harbour" }, images: [{ url: photos[2] }], isVerified: true }, { externalID: "BY-BAD-1", title: "Incomplete record", price: null, location: { name: "JVC" } }] };
export const sampleDubizzleJson = { results: [{ listing_id: "DZ-72411", name: "Park Heights · Updated Boulevard View", price: 2350000, usage: "sale", type: "Apartment", bedrooms: 2, bathrooms: 2, size: 1067, community: "Dubai Hills", building_name: "Park Heights", photos: [photos[1]], features: ["Pool", "Gym", "Park access"], agent_name: "Maya Rahman", agency_name: "Zied Properties", verified: true }, { listing_id: "DZ-NEW-991", name: "JVC Circle · High Yield Unit", price: 980000, usage: "sale", type: "Apartment", bedrooms: 1, bathrooms: 2, size: 720, community: "JVC", photos: [photos[3]], furnished: "Furnished", verified: false }] };
