import type { BuyerProfile } from "@/lib/buyer-data";
import { initialProperties, type PropertyRecord } from "@/lib/property-data";

export type PurposeSegment = "buy" | "rent";
export type NearbyCategory = "Schools" | "Hospitals" | "Malls" | "Beaches" | "Metro stations" | "Parks" | "Airports" | "Business districts";

export type AreaBenchmark = {
  neighbourhood: string;
  purpose: PurposeSegment;
  propertyType: string;
  bedroomSegment: string;
  medianSalePrice: number;
  averageSalePrice: number;
  medianRentPrice: number;
  averageRentPrice: number;
  medianAedPerM2: number;
  priceRange: [number, number];
  listingCount: number;
  sampleSize: number;
  averageAreaSqFt: number;
  newListingsCount: number;
  verifiedListingsCount: number;
  verifiedListingPercentage: number;
  lowSampleWarning: boolean;
  sourceDate: string;
};

export type DldComparable = {
  id: string;
  transactionDate: string;
  area: string;
  building: string;
  propertyType: string;
  bedrooms: number;
  sizeSqFt: number;
  soldPrice: number;
  pricePerM2: number;
  transactionType: "Sale" | "Mortgage" | "Gift";
  sourceDate: string;
  matchReason: string;
};

export type YieldEstimate = {
  annualRent: number;
  grossYield: number;
  assumptions: string[];
  editable: boolean;
  manualOverride: boolean;
};

export type PriceSnapshot = { date: string; price: number };
export type NearbyPlace = { category: NearbyCategory; name: string; distanceKm: number; drivingMinutes?: number; walkingMinutes?: number; selected: boolean };
export type NeighbourhoodSummary = { area: string; lifestyle: string; transport: string; schools: string; familySuitability: string; investmentAttractiveness: string; typicalBuyerProfile: string; guardrail: string };
export type CommunityIntel = { area: string; demandScore: number; lifestyleScore: number; yieldScore: number; liquidityScore: number; medianSale: number; medianRent: number; medianAedPerM2: number; listings: number; verifiedShare: number; newListings: number; activeBuyerPersonas: string[]; trend: string; summary: string };
export type BuildingIntel = { building: string; community: string; developer: string; unitMix: string; averageAedPerM2: number; transactions: number; listingCount: number; qualityScore: number; serviceCharge: string; demandSignal: string; activeListings: string[] };
export type MarketComparison = { propertyId: string; listingPrice: number; listingAedPerM2: number; benchmarkAedPerM2: number; deltaPercent: number; label: "Below market" | "Fair range" | "Above market" | "Insufficient data"; explanation: string };
export type UndervaluedDealScore = { propertyId: string; score: number; label: "Weak" | "Fair" | "Good" | "Strong" | "Excellent"; upside: string; risk: string; explanation: string; factors: { label: string; score: number; detail: string }[] };
export type TrendingCommunity = { area: string; rank: number; momentum: number; reason: string; buyerPersonas: string[]; action: string };
export type PoiProximityScore = { category: NearbyCategory; nearest: string; distanceKm: number; minutes: string; score: number; buyerRelevance: string; selected: boolean };
export type CommunityLifestyleScore = { area: string; score: number; label: string; factors: { label: string; score: number; explanation: string }[]; guardrail: string };
export type MarketHeatmapCell = { area: string; metric: "Demand" | "Yield" | "Price growth" | "Opportunity"; score: number; label: string; reason: string };
export type AiMarketExplanation = { title: string; body: string; risks: string[]; recommendation: string; guardrail: string };
export type MonthlyCommunityReport = { area: string; month: string; sections: { title: string; content: string }[]; sourceDate: string };
export type DeveloperProjectIntel = { project: string; developer: string; community: string; handover: string; paymentPlan: string; projectQuality: number; activeInventory: number; benchmarkAedPerM2: number; riskNotes: string[] };
export type MarketForecast = { area: string; horizon: "3 months" | "6 months" | "12 months"; direction: "Softening" | "Stable" | "Improving"; confidence: number; assumptions: string[]; disclaimer: string };

const benchmarks: AreaBenchmark[] = [
  bm("Dubai Marina", "buy", "Apartment", "2 bed", 2_650_000, 2_790_000, 178_000, 186_000, 25_900, [1_450_000, 5_900_000], 412, 1_085, 46, 318),
  bm("Dubai Marina", "rent", "Apartment", "2 bed", 2_650_000, 2_720_000, 180_000, 192_000, 25_100, [95_000, 410_000], 356, 1_040, 38, 271),
  bm("Dubai Hills", "buy", "Apartment", "2 bed", 2_420_000, 2_510_000, 152_000, 160_000, 23_700, [1_250_000, 4_850_000], 295, 1_130, 31, 228),
  bm("Dubai Hills", "buy", "Villa", "4 bed", 5_800_000, 6_250_000, 315_000, 338_000, 20_900, [4_900_000, 10_800_000], 34, 3_120, 4, 22),
  bm("Dubai Creek Harbour", "buy", "Apartment", "1-2 bed", 2_150_000, 2_240_000, 138_000, 146_000, 22_650, [1_050_000, 4_200_000], 188, 1_020, 29, 142),
  bm("Downtown Dubai", "rent", "Apartment", "Studio-2 bed", 3_050_000, 3_320_000, 210_000, 228_000, 30_400, [105_000, 520_000], 224, 945, 21, 176),
  bm("JVC", "buy", "Townhouse", "3 bed", 2_050_000, 2_160_000, 145_000, 150_000, 14_600, [1_650_000, 2_900_000], 18, 1_820, 2, 9),
];

const comparables: DldComparable[] = [
  tx("dld_001", "2026-06-18", "Dubai Marina", "Marina Vista", "Apartment", 2, 1_121, 2_620_000, 25_086, "Sale"),
  tx("dld_002", "2026-06-11", "Dubai Marina", "Marina Vista", "Apartment", 2, 1_176, 2_780_000, 25_402, "Sale"),
  tx("dld_003", "2026-05-29", "Dubai Marina", "Marina Gate", "Apartment", 2, 1_080, 2_510_000, 25_014, "Mortgage"),
  tx("dld_004", "2026-06-16", "Dubai Hills", "Park Heights", "Apartment", 2, 1_042, 2_310_000, 23_843, "Sale"),
  tx("dld_005", "2026-06-07", "Dubai Hills", "Park Ridge", "Apartment", 2, 1_096, 2_420_000, 23_726, "Sale"),
  tx("dld_006", "2026-06-14", "Dubai Creek Harbour", "Creek Palace", "Apartment", 2, 1_025, 2_040_000, 21_414, "Sale"),
  tx("dld_007", "2026-06-04", "Downtown Dubai", "Address Residences", "Apartment", 0, 594, 1_420_000, 25_706, "Sale"),
  tx("dld_008", "2026-06-09", "Dubai Hills", "Sidra", "Villa", 4, 3_110, 5_950_000, 20_575, "Sale"),
];

const nearbyPlaces: Record<string, NearbyPlace[]> = {
  "Dubai Marina": [
    { category: "Malls", name: "Dubai Marina Mall", distanceKm: 0.8, drivingMinutes: 6, walkingMinutes: 10, selected: true },
    { category: "Metro stations", name: "DMCC Metro Station", distanceKm: 1.1, drivingMinutes: 8, walkingMinutes: 14, selected: true },
    { category: "Beaches", name: "JBR Beach", distanceKm: 1.6, drivingMinutes: 9, walkingMinutes: 21, selected: true },
    { category: "Schools", name: "Emirates International School Meadows", distanceKm: 5.2, drivingMinutes: 14, selected: true },
    { category: "Hospitals", name: "Saudi German Hospital", distanceKm: 8.4, drivingMinutes: 18, selected: false },
    { category: "Business districts", name: "Dubai Media City", distanceKm: 4.8, drivingMinutes: 12, selected: true },
  ],
  "Dubai Hills": [
    { category: "Parks", name: "Dubai Hills Park", distanceKm: 0.9, drivingMinutes: 5, walkingMinutes: 12, selected: true },
    { category: "Malls", name: "Dubai Hills Mall", distanceKm: 1.7, drivingMinutes: 7, selected: true },
    { category: "Schools", name: "GEMS International School", distanceKm: 3.2, drivingMinutes: 10, selected: true },
    { category: "Hospitals", name: "King's College Hospital Dubai", distanceKm: 2.4, drivingMinutes: 8, selected: true },
    { category: "Airports", name: "DXB Airport", distanceKm: 24, drivingMinutes: 28, selected: false },
  ],
  "Dubai Creek Harbour": [
    { category: "Malls", name: "Dubai Festival City Mall", distanceKm: 6.6, drivingMinutes: 13, selected: true },
    { category: "Parks", name: "Creek Island Central Park", distanceKm: 0.7, drivingMinutes: 4, walkingMinutes: 9, selected: true },
    { category: "Business districts", name: "DIFC", distanceKm: 12.8, drivingMinutes: 19, selected: true },
    { category: "Airports", name: "DXB Airport", distanceKm: 14.2, drivingMinutes: 18, selected: false },
  ],
  "Downtown Dubai": [
    { category: "Malls", name: "Dubai Mall", distanceKm: 1.0, drivingMinutes: 6, walkingMinutes: 12, selected: true },
    { category: "Metro stations", name: "Burj Khalifa / Dubai Mall Metro", distanceKm: 1.4, drivingMinutes: 7, walkingMinutes: 17, selected: true },
    { category: "Business districts", name: "DIFC", distanceKm: 3.1, drivingMinutes: 9, selected: true },
    { category: "Hospitals", name: "Mediclinic City Hospital", distanceKm: 8.6, drivingMinutes: 16, selected: false },
  ],
};

const summaries: Record<string, NeighbourhoodSummary> = {
  "Dubai Marina": { area: "Dubai Marina", lifestyle: "Waterfront towers, dining, walkability, beach access and a lively tenant base.", transport: "Metro, tram and Sheikh Zayed Road access make it practical for Marina, JLT, Media City and DIFC commuters.", schools: "Schools are usually a short drive rather than inside the tower cluster.", familySuitability: "Best for couples, small families and lifestyle-led buyers who value convenience over villa-style space.", investmentAttractiveness: "Established rental demand, liquidity and recognisable address support investor interest, but building-level service charges matter.", typicalBuyerProfile: "Yield investors, relocation tenants, waterfront lifestyle buyers.", guardrail: "Summary uses listing/DLD-style sample data and should be confirmed with live sources before publication." },
  "Dubai Hills": { area: "Dubai Hills", lifestyle: "Master-planned community with parks, mall access, quieter streets and family amenities.", transport: "Strong road connectivity; public transport is less central than Downtown or Marina.", schools: "Several school options are within a reasonable driving radius.", familySuitability: "High family suitability due to parks, healthcare, schools and larger layouts.", investmentAttractiveness: "Broad family demand and Emaar brand recognition support liquidity, with pricing sensitive to phase and view.", typicalBuyerProfile: "Family end-users, relocation buyers, capital appreciation investors.", guardrail: "School access and commute should be checked at the buyer's actual travel times." },
  "Dubai Creek Harbour": { area: "Dubai Creek Harbour", lifestyle: "Modern waterfront district with newer towers, views and a quieter master-community feel.", transport: "Good road access to Downtown and DXB; metro access depends on future connectivity and exact location.", schools: "School access is generally by car to surrounding districts.", familySuitability: "Good for buyers wanting modern amenities and open-space feel, less ideal if school proximity is the top requirement.", investmentAttractiveness: "Appeals to capital appreciation buyers due to master-plan growth, with rent evidence still maturing by building.", typicalBuyerProfile: "Capital appreciation investors, off-plan investors, young professionals.", guardrail: "Future infrastructure and supply pipeline should not be presented as guaranteed." },
  "Downtown Dubai": { area: "Downtown Dubai", lifestyle: "Premium urban core with retail, hotels, dining and landmark views.", transport: "Strong central access, metro availability and proximity to DIFC/Business Bay.", schools: "Schools are available by car; lifestyle and commute usually dominate the decision.", familySuitability: "Suitable for urban families and relocation buyers, but tower layout and traffic patterns matter.", investmentAttractiveness: "High liquidity and global recognition, with pricing influenced heavily by view, brand and building quality.", typicalBuyerProfile: "Luxury lifestyle buyers, relocation buyers, short-term rental investors.", guardrail: "Short-term rental assumptions need licence, occupancy and building-policy validation." },
};

export function getAreaBenchmark(property: PropertyRecord) {
  return benchmarks.find((item) => item.neighbourhood === property.neighbourhood && item.purpose === property.purpose && item.propertyType === property.propertyType) ?? benchmarks.find((item) => item.neighbourhood === property.neighbourhood) ?? benchmarks[0];
}

export function getAreaBenchmarks() {
  return benchmarks;
}

export function getDldComparables(property: PropertyRecord) {
  return comparables
    .map((item) => ({ item, score: comparableScore(property, item), reason: comparableReason(property, item) }))
    .filter((item) => item.score >= 35)
    .sort((a, b) => b.score - a.score || new Date(b.item.transactionDate).getTime() - new Date(a.item.transactionDate).getTime())
    .slice(0, 5)
    .map(({ item, reason }) => ({ ...item, matchReason: reason }));
}

export function summarizeComparables(items: DldComparable[]) {
  const count = Math.max(items.length, 1);
  return {
    averagePrice: Math.round(items.reduce((sum, item) => sum + item.soldPrice, 0) / count),
    averageAedPerM2: Math.round(items.reduce((sum, item) => sum + item.pricePerM2, 0) / count),
    sourceDate: items[0]?.sourceDate ?? "No source date",
  };
}

export function estimateRentalYield(property: PropertyRecord, annualRentOverride?: number): YieldEstimate {
  const benchmark = getAreaBenchmark({ ...property, purpose: "rent" });
  const estimatedAnnualRent = annualRentOverride ?? Math.round((benchmark?.medianRentPrice || property.price * 0.06) * (property.areaSqFt / Math.max(benchmark?.averageAreaSqFt || property.areaSqFt, 1)));
  return {
    annualRent: estimatedAnnualRent,
    grossYield: property.price ? Number(((estimatedAnnualRent / property.price) * 100).toFixed(2)) : 0,
    editable: true,
    manualOverride: annualRentOverride !== undefined,
    assumptions: [
      `Rent benchmark: ${property.neighbourhood} ${property.propertyType.toLowerCase()} sample.`,
      annualRentOverride !== undefined ? "Manual rent override is applied by broker." : "Annual rent is estimated from area rental benchmark and unit size.",
      "Gross yield excludes service charges, vacancy, maintenance, financing, acquisition costs and taxes.",
      "Broker can override annual rent before including the figure in investor reports.",
    ],
  };
}

export function getPriceHistory(property: PropertyRecord): PriceSnapshot[] {
  const drop = property.price > 2_000_000 ? [-0.05, -0.035, -0.02, 0] : [0.04, 0.025, 0.01, 0];
  return ["2026-04-01", "2026-05-01", "2026-06-01", "2026-06-24"].map((date, index) => ({ date, price: Math.round(property.price * (1 + drop[index])) }));
}

export function priceMovement(history: PriceSnapshot[]) {
  const first = history[0]?.price ?? 0;
  const last = history.at(-1)?.price ?? first;
  const delta = last - first;
  return { delta, percent: first ? Number(((delta / first) * 100).toFixed(1)) : 0, direction: delta > 0 ? "increase" : delta < 0 ? "drop" : "flat" };
}

export function getNearbyPlaces(area: string) {
  return nearbyPlaces[area] ?? nearbyPlaces["Dubai Marina"];
}

export function getNeighbourhoodSummary(area: string) {
  return summaries[area] ?? summaries["Dubai Marina"];
}

export function buyerSpecificNeighbourhoodFit(buyer: BuyerProfile, area: string) {
  const summary = getNeighbourhoodSummary(area);
  if (buyer.persona === "End-user family buyer") return `For ${buyer.name}, ${area} should be judged on school access, parks, family routines and commute to ${buyer.workLocation}. ${summary.familySuitability}`;
  if (buyer.persona.includes("investor") || buyer.persona.includes("Investor")) return `For ${buyer.name}, ${area} should be judged on rental demand, liquidity, price discipline and exit options. ${summary.investmentAttractiveness}`;
  if (buyer.persona === "Luxury lifestyle buyer") return `For ${buyer.name}, ${area} should be judged on views, exclusivity, finish, privacy and premium amenities. ${summary.lifestyle}`;
  if (buyer.persona === "Relocation buyer") return `For ${buyer.name}, ${area} should be judged on convenience, commute, services, furnished supply and ease of settling in. ${summary.transport}`;
  return `${area} fit should be assessed against ${buyer.name}'s stated budget, timeline and lifestyle requirements. ${summary.lifestyle}`;
}

export function listingsForArea(area: string) {
  return initialProperties.filter((property) => property.neighbourhood === area);
}

export function getCommunityIntel(area: string): CommunityIntel {
  const benchmark = getAreaBenchmarks().find((item) => item.neighbourhood === area) ?? getAreaBenchmarks()[0];
  const summary = getNeighbourhoodSummary(area);
  const demandScore = area === "Dubai Marina" ? 88 : area === "Dubai Hills" ? 84 : area === "Dubai Creek Harbour" ? 79 : area === "Downtown Dubai" ? 86 : 72;
  return {
    area,
    demandScore,
    lifestyleScore: calculateLifestyleScore(area).score,
    yieldScore: Math.min(95, Math.round((benchmark.medianRentPrice / Math.max(benchmark.medianSalePrice, 1)) * 1_000)),
    liquidityScore: area === "Dubai Marina" || area === "Downtown Dubai" ? 91 : area === "Dubai Hills" ? 84 : 76,
    medianSale: benchmark.medianSalePrice,
    medianRent: benchmark.medianRentPrice,
    medianAedPerM2: benchmark.medianAedPerM2,
    listings: benchmark.listingCount,
    verifiedShare: benchmark.verifiedListingPercentage,
    newListings: benchmark.newListingsCount,
    activeBuyerPersonas: summary.typicalBuyerProfile.split(",").map((item) => item.trim()),
    trend: demandScore >= 85 ? "Rising buyer demand" : demandScore >= 78 ? "Selective momentum" : "Needs more evidence",
    summary: summary.lifestyle,
  };
}

export function getBuildingIntel(building: string): BuildingIntel {
  const property = initialProperties.find((item) => item.building === building) ?? initialProperties[0];
  const benchmark = getAreaBenchmark(property);
  const activeListings = initialProperties.filter((item) => item.building === property.building).map((item) => item.title);
  return {
    building: property.building || building,
    community: property.neighbourhood,
    developer: property.developer || "Developer not provided",
    unitMix: property.rooms ? `${property.rooms}-bed ${property.propertyType.toLowerCase()} focus` : "Studio / compact units",
    averageAedPerM2: benchmark.medianAedPerM2,
    transactions: getDldComparables(property).length,
    listingCount: activeListings.length || 1,
    qualityScore: property.verified ? 88 : 68,
    serviceCharge: "Service-charge placeholder · verify before client use",
    demandSignal: property.estimatedYield && property.estimatedYield >= 6 ? "Investor demand signal" : "Lifestyle-led demand signal",
    activeListings,
  };
}

export function compareListingToMarket(property: PropertyRecord): MarketComparison {
  const benchmark = getAreaBenchmark(property);
  const listingAedPerM2 = Math.round(property.price / Math.max(property.areaSqFt, 1));
  const benchmarkAedPerM2 = benchmark.medianAedPerM2;
  const deltaPercent = Number((((listingAedPerM2 - benchmarkAedPerM2) / Math.max(benchmarkAedPerM2, 1)) * 100).toFixed(1));
  const label: MarketComparison["label"] = !benchmarkAedPerM2 ? "Insufficient data" : deltaPercent <= -6 ? "Below market" : deltaPercent >= 8 ? "Above market" : "Fair range";
  return {
    propertyId: property.id,
    listingPrice: property.price,
    listingAedPerM2,
    benchmarkAedPerM2,
    deltaPercent,
    label,
    explanation: `${property.title} is ${Math.abs(deltaPercent)}% ${deltaPercent < 0 ? "below" : "above"} the ${property.neighbourhood} ${property.propertyType.toLowerCase()} AED/m² benchmark. Source date: ${benchmark.sourceDate}.`,
  };
}

export function calculateUndervaluedDealScore(property: PropertyRecord): UndervaluedDealScore {
  const comparison = compareListingToMarket(property);
  const yieldEstimate = estimateRentalYield(property);
  const comparables = summarizeComparables(getDldComparables(property));
  const comparableDelta = comparables.averagePrice ? (comparables.averagePrice - property.price) / comparables.averagePrice : 0;
  const benchmarkDiscount = comparison.deltaPercent < 0 ? Math.min(25, Math.abs(comparison.deltaPercent) * 2.2) : Math.max(0, 12 - comparison.deltaPercent);
  const comparableScore = Math.max(0, Math.min(20, comparableDelta * 100));
  const yieldScore = Math.min(18, yieldEstimate.grossYield * 2.3);
  const dataConfidence = property.verified ? 14 : 7;
  const freshnessProxy = new Date(property.scrapedAt).getTime() >= new Date("2026-06-20").getTime() ? 12 : 7;
  const score = Math.round(Math.min(100, benchmarkDiscount + comparableScore + yieldScore + dataConfidence + freshnessProxy + 10));
  const label: UndervaluedDealScore["label"] = score >= 85 ? "Excellent" : score >= 75 ? "Strong" : score >= 62 ? "Good" : score >= 45 ? "Fair" : "Weak";
  return {
    propertyId: property.id,
    score,
    label,
    upside: comparison.label === "Below market" ? "Price sits below area AED/m² benchmark with visible rent assumptions." : "Commercial upside depends on negotiation, rent validation and building quality.",
    risk: property.verified ? "Market assumptions still need official/live validation." : "Listing is not verified, so broker should validate source and availability.",
    explanation: `${label} undervalued score based on benchmark discount, comparable proxy, indicative yield, verification and freshness.`,
    factors: [
      { label: "Benchmark discount", score: Math.round(benchmarkDiscount), detail: comparison.explanation },
      { label: "Comparable discount", score: Math.round(comparableScore), detail: comparables.averagePrice ? `Average comparable price ${comparables.averagePrice.toLocaleString()} AED.` : "No comparables available." },
      { label: "Yield", score: Math.round(yieldScore), detail: `${yieldEstimate.grossYield}% indicative gross yield.` },
      { label: "Data confidence", score: dataConfidence, detail: property.verified ? "Verified listing signal present." : "Verification missing." },
      { label: "Freshness", score: freshnessProxy, detail: `Scraped ${new Date(property.scrapedAt).toLocaleDateString("en-GB")}.` },
    ],
  };
}

export function getTrendingCommunities(): TrendingCommunity[] {
  return ["Dubai Marina", "Dubai Hills", "Dubai Creek Harbour", "Downtown Dubai", "JVC"].map((area, index) => {
    const intel = getCommunityIntel(area);
    return { area, rank: index + 1, momentum: Math.max(58, intel.demandScore - index * 4), reason: `${intel.trend}: ${intel.newListings} new listings, ${intel.verifiedShare}% verified share, ${intel.activeBuyerPersonas[0]} demand.`, buyerPersonas: intel.activeBuyerPersonas, action: "Open community dashboard" };
  }).sort((a, b) => b.momentum - a.momentum).map((item, index) => ({ ...item, rank: index + 1 }));
}

export function getPoiProximityAnalysis(area: string): PoiProximityScore[] {
  return getNearbyPlaces(area).map((place) => {
    const minutes = place.drivingMinutes ? `${place.drivingMinutes} min drive` : place.walkingMinutes ? `${place.walkingMinutes} min walk` : "Time n/a";
    const score = Math.max(45, Math.round(100 - place.distanceKm * 7));
    return { category: place.category, nearest: place.name, distanceKm: place.distanceKm, minutes, score, buyerRelevance: place.category === "Schools" ? "Family buyer relevance" : place.category === "Metro stations" ? "Relocation and commute relevance" : place.category === "Beaches" ? "Lifestyle relevance" : "Amenity relevance", selected: place.selected };
  });
}

export function calculateLifestyleScore(area: string, buyerPersona?: string): CommunityLifestyleScore {
  const places = getNearbyPlaces(area);
  const hasSchool = places.some((item) => item.category === "Schools");
  const hasTransit = places.some((item) => item.category === "Metro stations");
  const hasLeisure = places.some((item) => ["Malls", "Beaches", "Parks"].includes(item.category));
  const baseFactors = [
    { label: "Family fit", score: hasSchool || area === "Dubai Hills" ? 86 : 68, explanation: hasSchool ? "School access appears in nearby-place sample." : "Family fit depends on driving radius and exact buyer needs." },
    { label: "Walkability", score: area === "Dubai Marina" || area === "Downtown Dubai" ? 88 : 62, explanation: "Walkability is inferred from urban amenities and transport sample." },
    { label: "Transport", score: hasTransit ? 90 : 66, explanation: hasTransit ? "Metro/tram proximity exists in demo POIs." : "Road access is stronger than public transport in this sample." },
    { label: "Amenities", score: hasLeisure ? 88 : 70, explanation: "Malls, beaches, parks and services improve lifestyle depth." },
    { label: "Persona fit", score: buyerPersona?.includes("investor") ? getCommunityIntel(area).yieldScore : area === "Dubai Hills" ? 87 : 78, explanation: buyerPersona ? `Adjusted for ${buyerPersona}.` : "General buyer-persona fit." },
  ];
  const score = Math.round(baseFactors.reduce((sum, item) => sum + item.score, 0) / baseFactors.length);
  return { area, score, label: score >= 85 ? "Excellent lifestyle fit" : score >= 72 ? "Strong lifestyle fit" : "Selective fit", factors: baseFactors, guardrail: "Lifestyle score is indicative and should avoid unsupported safety or guaranteed-demand claims." };
}

export function getMarketHeatmap(metric: MarketHeatmapCell["metric"]): MarketHeatmapCell[] {
  return getTrendingCommunities().map((community) => {
    const intel = getCommunityIntel(community.area);
    const score = metric === "Demand" ? intel.demandScore : metric === "Yield" ? intel.yieldScore : metric === "Price growth" ? 70 + community.rank * 3 : Math.round((intel.demandScore + intel.yieldScore + intel.liquidityScore) / 3);
    return { area: community.area, metric, score, label: score >= 85 ? "Hot" : score >= 74 ? "Warm" : "Selective", reason: `${metric} heat uses fake demand, yield, listings and benchmark proxies.` };
  });
}

export function generateMarketExplanation(input: PropertyRecord | string): AiMarketExplanation {
  const property = typeof input === "string" ? initialProperties.find((item) => item.neighbourhood === input) : input;
  const area = typeof input === "string" ? input : property?.neighbourhood ?? "Dubai Marina";
  const community = getCommunityIntel(area);
  const comparison = property ? compareListingToMarket(property) : undefined;
  return {
    title: property ? `${property.title} market explanation` : `${area} market explanation`,
    body: property ? `${property.title} is positioned in ${area}, where median AED/m² is AED ${community.medianAedPerM2.toLocaleString()}. The listing is labelled ${comparison?.label.toLowerCase()} versus the local benchmark. This is useful for a broker narrative, but should be verified before client reliance.` : `${area} shows ${community.trend.toLowerCase()} with ${community.listings} active benchmark listings and ${community.verifiedShare}% verified share in the demo dataset.`,
    risks: ["Source data is fake/local in this milestone.", "DLD, Google Maps and live portal feeds are not connected.", "No return, appreciation or liquidity is guaranteed."],
    recommendation: property ? "Use benchmark, comparable and yield sections together before making a price recommendation." : "Use community dashboard and POI analysis to tailor the explanation by buyer persona.",
    guardrail: "Indicative explanation only; source dates and assumptions must remain visible in client-facing output.",
  };
}

export function getMonthlyCommunityReport(area: string): MonthlyCommunityReport {
  const intel = getCommunityIntel(area);
  const lifestyle = calculateLifestyleScore(area);
  return {
    area,
    month: "June 2026",
    sourceDate: "24 Jun 2026",
    sections: [
      { title: "Pricing", content: `Median sale ${intel.medianSale.toLocaleString()} AED and median AED/m² ${intel.medianAedPerM2.toLocaleString()} AED in the demo benchmark.` },
      { title: "Rent and yield", content: `Median rent ${intel.medianRent.toLocaleString()} AED; yield score ${intel.yieldScore}/100, indicative only.` },
      { title: "Listings", content: `${intel.listings} listings, ${intel.newListings} new, ${intel.verifiedShare}% verified share.` },
      { title: "Lifestyle", content: `${lifestyle.label}: ${lifestyle.factors.slice(0, 3).map((item) => item.label).join(", ")}.` },
      { title: "Risks", content: "Live availability, transaction evidence, service charges, and buyer-specific commute should be verified." },
    ],
  };
}

export function getDeveloperProjectIntel(project: string): DeveloperProjectIntel {
  const property = initialProperties.find((item) => item.building === project || item.title.includes(project)) ?? initialProperties[0];
  const benchmark = getAreaBenchmark(property);
  return {
    project: property.building || project,
    developer: property.developer || "Developer not provided",
    community: property.neighbourhood,
    handover: property.completionStatus === "Ready" ? "Ready / completed" : "Future handover placeholder",
    paymentPlan: property.paymentPlan || "Not provided",
    projectQuality: property.verified ? 86 : 69,
    activeInventory: initialProperties.filter((item) => item.building === property.building).length || 1,
    benchmarkAedPerM2: benchmark.medianAedPerM2,
    riskNotes: ["Developer/project data is demo-only.", "Payment plan and handover must be validated from official documents.", "Building-level service charges are placeholder only."],
  };
}

export function getMarketForecast(area: string): MarketForecast[] {
  const intel = getCommunityIntel(area);
  return [
    { area, horizon: "3 months", direction: intel.demandScore >= 84 ? "Improving" : "Stable", confidence: 68, assumptions: ["Current buyer demand remains stable", "No major new supply shock in demo model"], disclaimer: "Indicative model placeholder, not financial advice." },
    { area, horizon: "6 months", direction: intel.yieldScore >= 70 ? "Improving" : "Stable", confidence: 61, assumptions: ["Rental benchmark remains supportive", "Verified listings remain above current share"], disclaimer: "Forecast is fake/local and should not be used as a prediction." },
    { area, horizon: "12 months", direction: "Stable", confidence: 54, assumptions: ["Macro conditions unchanged", "Transaction liquidity remains consistent"], disclaimer: "Longer horizon has lower confidence and no guaranteed outcome." },
  ];
}

function bm(neighbourhood: string, purpose: PurposeSegment, propertyType: string, bedroomSegment: string, medianSalePrice: number, averageSalePrice: number, medianRentPrice: number, averageRentPrice: number, medianAedPerM2: number, priceRange: [number, number], listingCount: number, averageAreaSqFt: number, newListingsCount: number, verifiedListingsCount: number): AreaBenchmark {
  return {
    neighbourhood,
    purpose,
    propertyType,
    bedroomSegment,
    medianSalePrice,
    averageSalePrice,
    medianRentPrice,
    averageRentPrice,
    medianAedPerM2,
    priceRange,
    listingCount,
    sampleSize: listingCount,
    averageAreaSqFt,
    newListingsCount,
    verifiedListingsCount,
    verifiedListingPercentage: Math.round((verifiedListingsCount / Math.max(listingCount, 1)) * 100),
    lowSampleWarning: listingCount < 30,
    sourceDate: "24 Jun 2026",
  };
}

function tx(id: string, transactionDate: string, area: string, building: string, propertyType: string, bedrooms: number, sizeSqFt: number, soldPrice: number, pricePerM2: number, transactionType: DldComparable["transactionType"]): DldComparable {
  return { id, transactionDate, area, building, propertyType, bedrooms, sizeSqFt, soldPrice, pricePerM2, transactionType, sourceDate: "24 Jun 2026", matchReason: "Matched by area and property type" };
}

function comparableScore(property: PropertyRecord, item: DldComparable) {
  let score = 0;
  if (item.building && property.building && item.building.toLowerCase() === property.building.toLowerCase()) score += 35;
  if (item.area === property.neighbourhood) score += 25;
  if (item.propertyType === property.propertyType) score += 18;
  if (item.bedrooms === property.rooms) score += 12;
  if (Math.abs(item.sizeSqFt - property.areaSqFt) / Math.max(property.areaSqFt, 1) <= 0.2) score += 10;
  return score;
}

function comparableReason(property: PropertyRecord, item: DldComparable) {
  const reasons = [];
  if (item.building && property.building && item.building.toLowerCase() === property.building.toLowerCase()) reasons.push("same building/project");
  if (item.area === property.neighbourhood) reasons.push("same neighbourhood");
  if (item.propertyType === property.propertyType) reasons.push("same property type");
  if (item.bedrooms === property.rooms) reasons.push("similar bedroom count");
  if (Math.abs(item.sizeSqFt - property.areaSqFt) / Math.max(property.areaSqFt, 1) <= 0.2) reasons.push("similar size range");
  return reasons.length ? `Matched by ${reasons.join(", ")}` : "No strong match reason";
}
