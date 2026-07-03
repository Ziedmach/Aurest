export type BuyerStatus = "New lead" | "Qualified" | "Shortlist sent" | "Report sent" | "Viewing scheduled" | "Negotiation" | "Won" | "Lost" | "On hold";
export type BuyerPersona = "End-user family buyer" | "Rental yield investor" | "Capital appreciation investor" | "Luxury lifestyle buyer" | "Relocation buyer" | "First-time buyer" | "Short-term rental investor" | "Off-plan investor";

export type BuyerProfile = {
  id: string;
  workspaceId: string;
  name: string;
  phone: string;
  email: string;
  nationality: string;
  purpose: "buy" | "rent";
  budgetMin: number;
  budgetMax: number;
  preferredAreas: string[];
  propertyTypes: string[];
  bedrooms: number;
  familySize: number;
  schoolNeeds: string;
  workLocation: string;
  lifestylePreferences: string;
  investmentObjective: string;
  timeline: string;
  financingStatus: string;
  notes: string;
  persona: BuyerPersona;
  personaExplanation: string;
  personaOverridden: boolean;
  needsSummary: BuyerNeedsSummary;
  status: BuyerStatus;
  lostReason: string;
  wonProperty: string;
  estimatedDealValue: number;
  owner: string;
  nextFollowUp: string;
  lastActivityAt: string;
  createdAt: string;
  savedSearches: number;
  reports: number;
  enrichment?: BuyerEnrichment;
};

export type BuyerNeedsSummary = {
  motivation: string;
  keyRequirements: string;
  budgetSensitivity: string;
  lifestyleNeeds: string;
  investmentIntent: string;
  likelyObjections: string;
  suggestedAreas: string;
  salesAngle: string;
};

export type BuyerEnrichment = {
  linkedinUrl: string;
  company: string;
  website: string;
  publicBio: string;
  crmData: string;
  conversationNotes: string;
  consentConfirmed: boolean;
  summary: string;
  enrichedAt: string;
};

export type BuyerActivityType = "created" | "updated" | "persona" | "shortlist" | "report" | "export" | "public-link" | "whatsapp" | "email" | "follow-up" | "status" | "note" | "view" | "assignment" | "summary" | "enrichment";
export type BuyerActivity = { id: string; buyerId: string; type: BuyerActivityType; title: string; detail: string; actor: string; time: string; timestamp: number };

const baseSummary: BuyerNeedsSummary = {
  motivation: "Secure a Dubai property that balances immediate usability with long-term value.",
  keyRequirements: "Well-located property, credible developer, practical layout, and transparent total cost.",
  budgetSensitivity: "Will stretch only for a clearly defensible location or return advantage.",
  lifestyleNeeds: "Easy access to daily amenities, transport, and a high-quality neighbourhood experience.",
  investmentIntent: "Protect capital while maintaining resale and rental liquidity.",
  likelyObjections: "Service charges, price per square foot, handover risk, and financing certainty.",
  suggestedAreas: "Dubai Marina, Dubai Hills Estate, Business Bay.",
  salesAngle: "Lead with evidence, comparable options, and a clear explanation of trade-offs.",
};

export const initialBuyerProfiles: BuyerProfile[] = [
  { id:"buy_omar",workspaceId:"ws_demo",name:"Omar Al Mansoori",phone:"+971 50 555 0182",email:"omar@example.com",nationality:"Emirati",purpose:"buy",budgetMin:2_000_000,budgetMax:3_200_000,preferredAreas:["Dubai Marina","Dubai Hills"],propertyTypes:["Apartment"],bedrooms:2,familySize:2,schoolNeeds:"Not required",workLocation:"DIFC",lifestylePreferences:"Waterfront, gym, walkability",investmentObjective:"Stable rental yield with long-term liquidity",timeline:"Within 3 months",financingStatus:"Mortgage pre-approved",notes:"Prefers ready units and clear rental evidence.",persona:"Rental yield investor",personaExplanation:"Yield, occupancy resilience, and resale liquidity are explicit priorities; the brief favours ready apartments in established rental areas.",personaOverridden:false,needsSummary:{...baseSummary,motivation:"Build a reliable income-producing Dubai asset.",keyRequirements:"Ready 2-bedroom apartment, proven rental demand, strong building management, and gross yield above 6%.",investmentIntent:"Stable rental yield first, with capital preservation and easy resale.",suggestedAreas:"Dubai Marina, JLT, Dubai Creek Harbour."},status:"Qualified",lostReason:"",wonProperty:"",estimatedDealValue:0,owner:"Zied",nextFollowUp:"Call today 16:00",lastActivityAt:"Today · 09:42",createdAt:"22 Jun 2026",savedSearches:2,reports:3 },
  { id:"buy_sarah",workspaceId:"ws_demo",name:"Sarah Ahmed",phone:"+971 55 123 9081",email:"sarah@example.com",nationality:"British",purpose:"buy",budgetMin:3_500_000,budgetMax:5_000_000,preferredAreas:["Dubai Hills","Arabian Ranches"],propertyTypes:["Villa","Townhouse"],bedrooms:4,familySize:5,schoolNeeds:"British curriculum within 15 minutes",workLocation:"Dubai Internet City",lifestylePreferences:"Parks, community pool, quiet streets",investmentObjective:"Primary family home",timeline:"Before next school term",financingStatus:"Cash + mortgage",notes:"School run and outdoor space are decisive.",persona:"End-user family buyer",personaExplanation:"The decision is driven by family size, school access, outdoor space, and community quality rather than yield.",personaOverridden:false,needsSummary:{...baseSummary,motivation:"Move the family before the next school term.",keyRequirements:"4 bedrooms, safe community, garden, nearby British school, and manageable commute.",lifestyleNeeds:"Parks, community facilities, privacy, and family-oriented amenities.",investmentIntent:"Long-term family occupation with sensible resale value.",suggestedAreas:"Dubai Hills Estate, Arabian Ranches, Tilal Al Ghaf."},status:"Viewing scheduled",lostReason:"",wonProperty:"",estimatedDealValue:0,owner:"Zied",nextFollowUp:"Viewing reminder · 26 Jun",lastActivityAt:"Today · 08:30",createdAt:"20 Jun 2026",savedSearches:1,reports:1 },
  { id:"buy_james",workspaceId:"ws_demo",name:"James Liu",phone:"+971 52 777 1164",email:"james@example.com",nationality:"Singaporean",purpose:"rent",budgetMin:180_000,budgetMax:260_000,preferredAreas:["Downtown Dubai","Business Bay"],propertyTypes:["Apartment"],bedrooms:2,familySize:2,schoolNeeds:"Not required",workLocation:"DIFC",lifestylePreferences:"Metro access, furnished, city view",investmentObjective:"Relocation home",timeline:"Within 6 weeks",financingStatus:"Company housing allowance",notes:"Arriving in Dubai mid-July.",persona:"Relocation buyer",personaExplanation:"A fixed move date, work location, furnishing needs, and rapid orientation requirements make this a relocation-led search.",personaOverridden:false,needsSummary:{...baseSummary,motivation:"Secure a move-in-ready home before relocation.",keyRequirements:"Furnished 2-bedroom, short DIFC commute, metro access, and responsive building management.",budgetSensitivity:"Company allowance creates a firm annual ceiling.",investmentIntent:"No investment objective; convenience and certainty dominate.",suggestedAreas:"Downtown Dubai, Business Bay, DIFC."},status:"Report sent",lostReason:"",wonProperty:"",estimatedDealValue:0,owner:"Maya",nextFollowUp:"Follow up tomorrow",lastActivityAt:"Yesterday · 17:10",createdAt:"18 Jun 2026",savedSearches:1,reports:1 },
  { id:"buy_lina",workspaceId:"ws_demo",name:"Lina Haddad",phone:"+971 56 221 4510",email:"lina@example.com",nationality:"Lebanese",purpose:"buy",budgetMin:1_200_000,budgetMax:2_000_000,preferredAreas:["Dubai Creek Harbour","JVC"],propertyTypes:["Apartment"],bedrooms:1,familySize:1,schoolNeeds:"Not required",workLocation:"Remote",lifestylePreferences:"New community, modern amenities",investmentObjective:"Capital appreciation through off-plan entry",timeline:"This quarter",financingStatus:"Cash buyer",notes:"Open to 2027–2028 handover.",persona:"Off-plan investor",personaExplanation:"The buyer accepts future handover and prioritises entry pricing, developer credibility, and appreciation potential.",personaOverridden:false,needsSummary:{...baseSummary,motivation:"Enter a growth corridor at an attractive launch price.",keyRequirements:"Reputable developer, staged payment plan, 1-bedroom, and strong future community plan.",investmentIntent:"Capital appreciation through an off-plan purchase.",suggestedAreas:"Dubai Creek Harbour, Dubai South, JVC."},status:"New lead",lostReason:"",wonProperty:"",estimatedDealValue:0,owner:"Zied",nextFollowUp:"Complete qualification",lastActivityAt:"23 Jun · 14:15",createdAt:"23 Jun 2026",savedSearches:1,reports:0 },
];

export const initialBuyerActivity: BuyerActivity[] = [
  {id:"act_1",buyerId:"buy_omar",type:"report",title:"Report generated",detail:"Marina investment comparison · 3 properties",actor:"Zied",time:"Today · 09:42",timestamp:5},
  {id:"act_2",buyerId:"buy_omar",type:"shortlist",title:"Property shortlisted",detail:"Marina Vista · Full Sea View",actor:"Zied",time:"Yesterday · 16:20",timestamp:4},
  {id:"act_3",buyerId:"buy_omar",type:"persona",title:"Persona generated",detail:"Rental yield investor · 94% confidence",actor:"AI Copilot",time:"23 Jun · 11:05",timestamp:3},
  {id:"act_4",buyerId:"buy_omar",type:"created",title:"Buyer created",detail:"Workspace profile created and assigned to Zied",actor:"Zied",time:"22 Jun · 10:14",timestamp:1},
  {id:"act_5",buyerId:"buy_sarah",type:"status",title:"Status changed",detail:"Qualified → Viewing scheduled",actor:"Zied",time:"Today · 08:30",timestamp:5},
];

export const buyerPersonas: BuyerPersona[] = ["End-user family buyer","Rental yield investor","Capital appreciation investor","Luxury lifestyle buyer","Relocation buyer","First-time buyer","Short-term rental investor","Off-plan investor"];
export const buyerStatuses: BuyerStatus[] = ["New lead","Qualified","Shortlist sent","Report sent","Viewing scheduled","Negotiation","Won","Lost","On hold"];

export function classifyBuyer(profile: BuyerProfile): { persona: BuyerPersona; explanation: string } {
  const text = `${profile.investmentObjective} ${profile.lifestylePreferences} ${profile.timeline}`.toLowerCase();
  if (text.includes("off-plan") || text.includes("handover")) return { persona:"Off-plan investor", explanation:"The buyer accepts future handover and prioritises entry pricing, payment structure, developer credibility, and capital appreciation." };
  if (text.includes("yield") || text.includes("rental")) return { persona:"Rental yield investor", explanation:"Rental return, occupancy resilience, and asset liquidity are the strongest signals in the buyer brief." };
  if (profile.purpose === "rent" || text.includes("relocation")) return { persona:"Relocation buyer", explanation:"The fixed move timeline, workplace access, and lifestyle setup make this a relocation-led search." };
  if (profile.familySize >= 3 || profile.schoolNeeds.toLowerCase() !== "not required") return { persona:"End-user family buyer", explanation:"Family size, school needs, community facilities, and long-term liveability dominate the decision." };
  if (profile.budgetMax >= 8_000_000 || text.includes("luxury")) return { persona:"Luxury lifestyle buyer", explanation:"Premium lifestyle, scarcity, privacy, and prestige matter more than headline yield." };
  return { persona:"Capital appreciation investor", explanation:"Location growth, entry price, and future resale value are the clearest buying signals." };
}

export function generateBuyerSummary(profile: BuyerProfile): BuyerNeedsSummary {
  return {
    motivation: profile.investmentObjective || `Find a suitable Dubai property within ${profile.timeline.toLowerCase()}.`,
    keyRequirements: `${profile.bedrooms || "Studio"} bedroom ${profile.propertyTypes.join(" or ").toLowerCase()} in ${profile.preferredAreas.join(" or ")}; ${profile.financingStatus.toLowerCase()}.`,
    budgetSensitivity: `Target budget AED ${profile.budgetMin.toLocaleString()}–${profile.budgetMax.toLocaleString()}; justify any stretch with measurable value.`,
    lifestyleNeeds: profile.lifestylePreferences || "No specific lifestyle preferences captured yet.",
    investmentIntent: profile.investmentObjective || "No investment objective captured.",
    likelyObjections: "Price versus comparables, service charges, location trade-offs, and transaction certainty.",
    suggestedAreas: profile.preferredAreas.join(", ") || "Generate after preferred areas are captured.",
    salesAngle: profile.familySize >= 3 ? "Lead with daily family fit, school access, community quality, then resale resilience." : "Lead with evidence, comparable alternatives, and a transparent value case.",
  };
}
