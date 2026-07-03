export type WorkspaceType = "solo" | "team" | "agency";
export type BrandingPriority = "personal" | "company";
export type ReportBrandingMode = "personal" | "team" | "agency" | "co-brand";
export type WorkspaceContentDefaults = {
  defaultLanguage: "English" | "Arabic" | "French";
  defaultTone: "Professional" | "Friendly" | "Luxury" | "Investor-focused" | "Family-focused" | "Short WhatsApp" | "Detailed advisory" | "Direct and concise";
  defaultReportStyle: "premium" | "minimal" | "editorial";
  defaultMessageLength: "Short" | "Balanced" | "Detailed";
  defaultDisclaimer: string;
  defaultReportTemplate: "investor" | "family" | "off-plan" | "luxury" | "rental-yield" | "short" | "comparison" | "viewing-prep";
  brokerCanOverride: boolean;
  agencyLocksDefaults: boolean;
};

export type Workspace = {
  id: string;
  name: string;
  type: WorkspaceType;
  logoText: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  footer: string;
  disclaimer: string;
  signature: string;
  coverStyle: "premium" | "minimal" | "editorial";
  brandingLocked: boolean;
  lockedBrandFields: {
    logo: boolean;
    colors: boolean;
    disclaimer: boolean;
    footer: boolean;
  };
  defaultBrandingMode: ReportBrandingMode;
  agencyAllowsAgentCobranding: boolean;
  contentDefaults: WorkspaceContentDefaults;
  plan: string;
};

export type BrokerProfile = {
  fullName: string;
  photoUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  reraNumber: string;
  companyName: string;
  jobTitle: string;
  profileUrl: string;
  linkedInUrl: string;
  personalWebsite: string;
  specialization: string;
  languages: string;
  areasServed: string;
  yearsExperience: string;
  profileSignature: string;
  bio: string;
  brandingPriority: BrandingPriority;
};

export const initialWorkspace: Workspace = {
  id: "ws_zied_properties",
  name: "Zied Properties",
  type: "solo",
  logoText: "ZP",
  logoUrl: "",
  primaryColor: "#0d756c",
  secondaryColor: "#c69b55",
  contactEmail: "hello@ziedproperties.ae",
  contactPhone: "+971 50 000 0000",
  website: "ziedproperties.ae",
  footer: "Independent Dubai property advisory",
  disclaimer: "Market insights are generated using available listing, neighbourhood, and transaction data where available. Final property decisions should be verified with official sources and licensed professionals.",
  signature: "Zied Machkena · Licensed Dubai Real Estate Broker",
  coverStyle: "premium",
  brandingLocked: false,
  lockedBrandFields: { logo: false, colors: false, disclaimer: false, footer: false },
  defaultBrandingMode: "personal",
  agencyAllowsAgentCobranding: true,
  contentDefaults: {
    defaultLanguage: "English",
    defaultTone: "Professional",
    defaultReportStyle: "premium",
    defaultMessageLength: "Balanced",
    defaultDisclaimer: "Market and AI-generated content is advisory and should be reviewed before sharing.",
    defaultReportTemplate: "investor",
    brokerCanOverride: true,
    agencyLocksDefaults: false,
  },
  plan: "Solo Pro",
};

export const initialBrokerProfile: BrokerProfile = {
  fullName: "Zied Machkena",
  photoUrl: "",
  phone: "+971 50 000 0000",
  whatsapp: "+971 50 000 0000",
  email: "zied@example.com",
  reraNumber: "12345",
  companyName: "Zied Properties",
  jobTitle: "Dubai Real Estate Advisor",
  profileUrl: "linkedin.com/in/ziedmachkena",
  linkedInUrl: "linkedin.com/in/ziedmachkena",
  personalWebsite: "ziedproperties.ae/zied",
  specialization: "Investment property · Dubai Marina · Dubai Hills",
  languages: "English, Arabic, French",
  areasServed: "Dubai Marina, Dubai Hills, Downtown Dubai",
  yearsExperience: "8",
  profileSignature: "Zied Machkena · RERA 12345 · Dubai investment property advisor",
  bio: "Independent Dubai real estate advisor focused on transparent, data-backed property recommendations.",
  brandingPriority: "personal",
};

export const workspaceTypeMeta = {
  solo: { label: "Solo Broker", users: "1 user", description: "Personal brand, private buyers, and broker-led reports.", next: "team" as WorkspaceType },
  team: { label: "Small Team", users: "3–10 users", description: "Shared inventory, buyer assignment, and team branding.", next: "agency" as WorkspaceType },
  agency: { label: "Agency", users: "10–100+ users", description: "Roles, locked branding, analytics, and admin controls.", next: null },
};
