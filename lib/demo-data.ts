export type DemoBuyer = {
  id: string;
  name: string;
  initials: string;
  persona: string;
  budget: string;
  areas: string;
  status: string;
  owner: string;
  nextAction: string;
};

export type DemoReport = {
  id: string;
  title: string;
  buyer: string;
  type: string;
  status: "Draft" | "Ready" | "Shared";
  updated: string;
  views: number;
};

export const demoBuyers: DemoBuyer[] = [
  { id: "buy_omar", name: "Omar Al Mansoori", initials: "OA", persona: "Yield investor", budget: "AED 2.0M–3.2M", areas: "Marina, Dubai Hills", status: "Qualified", owner: "Zied", nextAction: "Send shortlist today" },
  { id: "buy_sarah", name: "Sarah Ahmed", initials: "SA", persona: "Family end-user", budget: "AED 3.5M–5.0M", areas: "Dubai Hills, Arabian Ranches", status: "Viewing scheduled", owner: "Zied", nextAction: "Viewing · 26 Jun" },
  { id: "buy_james", name: "James Liu", initials: "JL", persona: "Relocation buyer", budget: "AED 1.8M–2.6M", areas: "Downtown, Business Bay", status: "Shortlist sent", owner: "Maya", nextAction: "Follow up tomorrow" },
  { id: "buy_lina", name: "Lina Haddad", initials: "LH", persona: "Off-plan investor", budget: "AED 1.2M–2.0M", areas: "Dubai Creek, JVC", status: "New lead", owner: "Zied", nextAction: "Complete qualification" },
  { id: "buy_mohamed", name: "Mohamed Khalil", initials: "MK", persona: "Capital growth investor", budget: "AED 4.0M–6.5M", areas: "Palm Jumeirah, Marina", status: "Negotiation", owner: "Rami", nextAction: "Handle price objection" },
];

export const demoReports: DemoReport[] = [
  { id: "rep_001", title: "Marina Vista investment case", buyer: "Omar Al Mansoori", type: "Investor report", status: "Shared", updated: "Today, 09:42", views: 4 },
  { id: "rep_002", title: "Dubai Hills family shortlist", buyer: "Sarah Ahmed", type: "Comparison", status: "Ready", updated: "Yesterday", views: 0 },
  { id: "rep_003", title: "Downtown relocation options", buyer: "James Liu", type: "Short recommendation", status: "Draft", updated: "22 Jun", views: 0 },
  { id: "rep_004", title: "Palm Jumeirah opportunity", buyer: "Mohamed Khalil", type: "Luxury buyer", status: "Shared", updated: "20 Jun", views: 11 },
];

export const savedSearches = [
  { id: "search_1", name: "Omar · Marina yield", buyer: "Omar Al Mansoori", criteria: "Buy · 2 bed · AED 2–3.2M · Ready", matches: 12, newMatches: 3, active: true },
  { id: "search_2", name: "Sarah · Family villas", buyer: "Sarah Ahmed", criteria: "Buy · 3–4 bed · Dubai Hills / Ranches", matches: 8, newMatches: 1, active: true },
  { id: "search_3", name: "Lina · Off-plan entry", buyer: "Lina Haddad", criteria: "Buy · AED 1.2–2M · Handover < 2028", matches: 17, newMatches: 6, active: false },
];

export const activityEvents = [
  { icon: "report", title: "Report shared", detail: "Marina Vista investment case · Omar Al Mansoori", user: "Zied", time: "18 min ago" },
  { icon: "buyer", title: "Buyer qualified", detail: "Sarah Ahmed moved to Viewing scheduled", user: "Zied", time: "1 hr ago" },
  { icon: "property", title: "Property imported", detail: "42 Bayut listings normalized · 3 warnings", user: "Maya", time: "2 hrs ago" },
  { icon: "message", title: "Follow-up generated", detail: "Price objection response · Mohamed Khalil", user: "Rami", time: "Yesterday" },
  { icon: "settings", title: "Branding updated", detail: "Report cover and disclaimer changed", user: "Admin", time: "22 Jun" },
];

export const teamMembers = [
  { name: "Zied Machkena", initials: "ZM", role: "Owner", buyers: 12, reports: 18, activity: "Online" },
  { name: "Maya Rahman", initials: "MR", role: "Broker", buyers: 9, reports: 14, activity: "12 min ago" },
  { name: "Rami Haddad", initials: "RH", role: "Broker", buyers: 7, reports: 11, activity: "1 hr ago" },
  { name: "Noor Khan", initials: "NK", role: "Viewer", buyers: 0, reports: 0, activity: "Yesterday" },
];

export const marketAreas = [
  { area: "Dubai Marina", median: "AED 2.45M", sqm: "AED 24,800", yield: "6.3%", listings: 428, trend: "+3.8%" },
  { area: "Dubai Hills", median: "AED 3.10M", sqm: "AED 21,900", yield: "5.7%", listings: 312, trend: "+5.1%" },
  { area: "Downtown Dubai", median: "AED 3.75M", sqm: "AED 30,400", yield: "5.9%", listings: 506, trend: "+2.4%" },
  { area: "Dubai Creek Harbour", median: "AED 2.05M", sqm: "AED 20,700", yield: "6.6%", listings: 261, trend: "+6.2%" },
];
