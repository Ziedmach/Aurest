import type { BuyerProfile } from "@/lib/buyer-data";
import type { PropertyRecord } from "@/lib/property-data";

export type SalesTone = "Professional" | "Friendly" | "Luxury" | "Investor-focused" | "Family-focused" | "Short WhatsApp" | "Detailed advisory" | "Direct and concise";
export type SalesLanguage = "English" | "Arabic" | "French";
export type WhatsAppMessageType = "First recommendation" | "Follow-up" | "Price justification" | "Viewing invitation" | "Objection response" | "Short property summary";
export type ObjectionType = "Price is too high" | "Area is too far" | "Payment plan is not attractive" | "Developer risk" | "Property is too small" | "Not enough schools nearby" | "Rental yield is weak" | "Buyer wants to wait" | "Buyer is comparing with another property" | "Buyer wants better view" | "Buyer is unsure about off-plan" | "Buyer is worried about service charges";
export type FollowUpType = "Same-day follow-up" | "Next-day follow-up" | "3-day reminder" | "Alternative property suggestion" | "Viewing reminder" | "Urgency/availability message" | "Final check-in";
export type SalesContentType = "WhatsApp" | "Email" | "Call script" | "Follow-up" | "Objection";
export type CallScriptSection = { title: string; content: string };
export type FollowUpMessage = { id: string; type: FollowUpType; text: string; done: boolean };
export type ObjectionOutput = { whatsapp: string; callTalkingPoint: string; guardrail: string };
export type SalesContentHistoryItem = { id: string; buyerId: string; propertyIds: string[]; contentType: SalesContentType; tone: SalesTone; language: SalesLanguage; title: string; body: string; createdAt: string; copiedAt?: string; done?: boolean };

export const salesTones: SalesTone[] = ["Professional", "Friendly", "Luxury", "Investor-focused", "Family-focused", "Short WhatsApp", "Detailed advisory", "Direct and concise"];
export const salesLanguages: SalesLanguage[] = ["English", "Arabic", "French"];
export const whatsAppMessageTypes: WhatsAppMessageType[] = ["First recommendation", "Follow-up", "Price justification", "Viewing invitation", "Objection response", "Short property summary"];
export const objections: ObjectionType[] = ["Price is too high", "Area is too far", "Payment plan is not attractive", "Developer risk", "Property is too small", "Not enough schools nearby", "Rental yield is weak", "Buyer wants to wait", "Buyer is comparing with another property", "Buyer wants better view", "Buyer is unsure about off-plan", "Buyer is worried about service charges"];
export const followUpTypes: FollowUpType[] = ["Same-day follow-up", "Next-day follow-up", "3-day reminder", "Alternative property suggestion", "Viewing reminder", "Urgency/availability message", "Final check-in"];

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const firstName = (name: string) => name.split(" ")[0] || name;
const money = (value: number) => `AED ${number.format(value)}`;
const rooms = (property: PropertyRecord) => property.rooms ? `${property.rooms}-bed` : "studio";

function languagePrefix(language: SalesLanguage) {
  if (language === "Arabic") return "Arabic draft: ";
  if (language === "French") return "Brouillon français : ";
  return "";
}

function toneInstruction(tone: SalesTone) {
  if (tone === "Luxury") return "Keep it polished, selective, and premium.";
  if (tone === "Investor-focused") return "Lead with yield, liquidity, benchmark evidence, and downside risk.";
  if (tone === "Family-focused") return "Lead with schools, daily routine, space, commute, and comfort.";
  if (tone === "Friendly") return "Keep it warm, relaxed, and human.";
  if (tone === "Short WhatsApp") return "Keep it very short, natural, and mobile-friendly.";
  if (tone === "Detailed advisory") return "Use a consultative advisory style with explicit reasoning.";
  if (tone === "Direct and concise") return "Be direct, crisp, and action-oriented.";
  return "Keep it professional, concise, and clear.";
}

function propertyLine(property: PropertyRecord) {
  return `${property.title} in ${property.neighbourhood}, ${rooms(property)}, ${number.format(property.areaSqFt)} sq ft, ${money(property.price)}${property.purpose === "rent" ? "/year" : ""}`;
}

export function generateWhatsAppMessage(type: WhatsAppMessageType, buyer: BuyerProfile, property: PropertyRecord, tone: SalesTone, language: SalesLanguage, objection?: ObjectionType) {
  const intro = `Hi ${firstName(buyer.name)},`;
  const value = `${propertyLine(property)}.`;
  const yieldLine = property.estimatedYield ? `It has an indicative ${property.estimatedYield}% gross yield, useful for your ${buyer.persona.toLowerCase()} profile.` : "The main value is location, layout, and fit with your stated needs.";
  const variants: Record<WhatsAppMessageType, string> = {
    "First recommendation": `${intro} I found a strong option for you: ${value} ${yieldLine} Want me to send the short comparison and trade-offs?`,
    "Follow-up": `${intro} quick follow-up on ${property.title}. It still looks aligned with your budget, area preference, and timeline. Shall I keep it on the shortlist or send alternatives?`,
    "Price justification": `${intro} on price, I would compare ${property.neighbourhood}, ${number.format(property.areaSqFt)} sq ft, ${property.completionStatus.toLowerCase()}, and ${property.estimatedYield ? `${property.estimatedYield}% indicative yield` : "current alternatives"} before deciding. No guarantees, just a clearer comparison.`,
    "Viewing invitation": `${intro} this is worth seeing in person. ${property.title} matches enough of your brief to validate layout, view, building condition, and exact commute. Are you free tomorrow or the day after?`,
    "Objection response": `${intro} understood on “${objection ?? "the concern"}”. ${generateObjectionResponse(objection ?? "Price is too high", buyer, property, tone, language).whatsapp}`,
    "Short property summary": `${intro} short version: ${value} ${property.completionStatus}, ${property.estimatedYield ? `${property.estimatedYield}% indicative yield` : "lifestyle-led fit"}. Worth shortlisting.`,
  };
  return `${languagePrefix(language)}${variants[type]}\n\n${toneInstruction(tone)}`;
}

export function generateEmail(buyer: BuyerProfile, property: PropertyRecord, tone: SalesTone, language: SalesLanguage) {
  const subject = `${property.neighbourhood} option for your ${buyer.persona.toLowerCase()} brief`;
  const body = `Hi ${firstName(buyer.name)},\n\nI’m sharing ${property.title}, a ${rooms(property)} ${property.propertyType.toLowerCase()} in ${property.neighbourhood} priced at ${money(property.price)}${property.purpose === "rent" ? " per year" : ""}.\n\nWhy it fits your brief:\n- Area: relevant to ${buyer.preferredAreas.join(", ")}.\n- Budget: assessed against ${money(buyer.budgetMin)}–${money(buyer.budgetMax)}.\n- Need fit: supports ${buyer.investmentObjective.toLowerCase() || buyer.lifestylePreferences.toLowerCase()}.\n- Value: ${property.estimatedYield ? `${property.estimatedYield}% indicative gross yield, subject to rent/service-charge validation.` : `${property.completionStatus} property with practical lifestyle fundamentals.`}\n\nI can send the full report with buyer-fit reasoning, price context, risks, and next steps.\n\nBest,\nYour Dubai property advisor`;
  return { subject: `${languagePrefix(language)}${subject}`, body: `${body}\n\nStyle: ${toneInstruction(tone)}` };
}

export function generateCallScript(buyer: BuyerProfile, property: PropertyRecord, tone: SalesTone, language: SalesLanguage): CallScriptSection[] {
  return [
    { title: "Opening line", content: `${languagePrefix(language)}Hi ${firstName(buyer.name)}, I wanted to quickly walk you through one option that is relevant to your brief, not just send another listing.` },
    { title: "Buyer needs recap", content: `You’re looking for ${buyer.bedrooms || "studio"} bedroom options around ${buyer.preferredAreas.join(" or ")}, with a budget of ${money(buyer.budgetMin)}–${money(buyer.budgetMax)}. Your key motivation is ${buyer.needsSummary.motivation || buyer.investmentObjective || buyer.lifestylePreferences}.` },
    { title: "Recommended property explanation", content: `${propertyLine(property)} gives you ${property.completionStatus.toLowerCase()} status and ${property.amenities.slice(0, 3).join(", ").toLowerCase() || "core daily-use amenities"}.` },
    { title: "Price/value justification", content: `The price is ${money(property.price)}. I would justify it only after comparing price per area, building quality, view/layout, and ${property.estimatedYield ? `${property.estimatedYield}% indicative yield` : "current alternatives"}.` },
    { title: "Key objections to expect", content: expectedObjections(buyer, property).join(" · ") },
    { title: "Questions to ask", content: `Ask: “Is the location compromise acceptable?” “Is the layout enough?” “Would you prioritise price, view, or readiness?” “Should I send a side-by-side comparison?”` },
    { title: "Closing line", content: "My recommendation is not to rush; review the comparison, validate the assumptions, then decide whether it deserves a viewing." },
    { title: "Next action", content: "If it feels relevant, I’ll send the report and propose a viewing slot. If not, I’ll refine the shortlist around the concern you mention." },
    { title: "Tone/language guardrail", content: `${toneInstruction(tone)} Avoid false guarantees around price, yield, availability, appreciation, or school access.` },
  ];
}

export function generateFollowUps(buyer: BuyerProfile, property: PropertyRecord, tone: SalesTone, language: SalesLanguage, count = 5): FollowUpMessage[] {
  const base: Record<FollowUpType, string> = {
    "Same-day follow-up": `Hi ${firstName(buyer.name)}, what was your first impression of ${property.title}? Should I keep it in the shortlist or adjust the search?`,
    "Next-day follow-up": `Hi ${firstName(buyer.name)}, yesterday’s option in ${property.neighbourhood} still looks relevant to your ${buyer.persona.toLowerCase()} brief. Want me to send the report?`,
    "3-day reminder": `Quick reminder: if this option is still interesting, I’d review it this week while the information is fresh and before availability changes.`,
    "Alternative property suggestion": `If ${property.title} is not ideal, I can send two alternatives: one stronger on price and one stronger on lifestyle or investment fit.`,
    "Viewing reminder": `For the viewing, focus on layout, view/noise, building condition, parking, service charges, and whether the daily routine works.`,
    "Urgency/availability message": `I do not want to create pressure, but good-fit options can change quickly. If it meets your criteria, the next step is to validate it, not wait blindly.`,
    "Final check-in": `Should we move forward, keep this as backup, or remove it from the shortlist? I’ll align the next step with your decision.`,
  };
  return followUpTypes.slice(0, Math.max(3, Math.min(count, 5))).map((type, index) => ({ id: `follow_${index + 1}`, type, text: `${languagePrefix(language)}${base[type]}\n\n${toneInstruction(tone)}`, done: false }));
}

export function generateObjectionResponse(objection: ObjectionType, buyer: BuyerProfile, property: PropertyRecord, tone: SalesTone, language: SalesLanguage): ObjectionOutput {
  const core = objectionResponse(objection, buyer, property, "whatsapp");
  return {
    whatsapp: `${languagePrefix(language)}${core} I’d validate it with comparables before making a decision.\n\n${toneInstruction(tone)}`,
    callTalkingPoint: `${languagePrefix(language)}Acknowledge first, then say: ${objectionResponse(objection, buyer, property, "call")} Close by asking what evidence would make the buyer comfortable.`,
    guardrail: "Avoid guarantees. Validate price, yield, availability, developer claims, service charges, school access, and future appreciation with official/current sources.",
  };
}

export function objectionResponse(objection: ObjectionType, buyer: BuyerProfile, property: PropertyRecord, channel: "whatsapp" | "call" = "whatsapp") {
  const responses: Record<ObjectionType, string> = {
    "Price is too high": `That is valid. For ${buyer.name}, I would compare price per sq ft, building quality, view/layout, and alternatives in ${buyer.preferredAreas.join(" / ")} before accepting the asking price.`,
    "Area is too far": `The area only works if the value or lifestyle gain offsets the commute to ${buyer.workLocation || "daily destinations"}. I would compare it with one closer option.`,
    "Payment plan is not attractive": `The payment plan should protect cash flow. If it feels heavy, we either negotiate structure or move to a cleaner plan with similar fundamentals.`,
    "Developer risk": `We should verify developer track record, escrow/project status, handover history, service charges, and resale evidence. If confidence is not there, we remove it.`,
    "Property is too small": `At ${number.format(property.areaSqFt)} sq ft, the question is usable layout, storage, bedroom proportions, and whether it fits daily life, not just headline size.`,
    "Not enough schools nearby": `For a family-led decision, school access is material. We should confirm realistic drive times and compare against stronger school-access areas.`,
    "Rental yield is weak": property.estimatedYield ? `${property.estimatedYield}% yield is only acceptable if liquidity, tenant demand, and capital protection are strong. If yield is the priority, benchmark against higher-yield alternatives.` : "Yield needs proper rent evidence before positioning this as an investor option.",
    "Buyer wants to wait": `Waiting can help if supply improves, but it can also mean missing a well-fitted unit. I would keep a tight watchlist and act only if the evidence is clear.`,
    "Buyer is comparing with another property": `Good. Compare objectively: net price, size, location, building quality, service charges, yield, completion status, and exit liquidity.`,
    "Buyer wants better view": `View can matter for lifestyle and resale, but it needs to be priced correctly. I would compare the view premium against layout, floor, and total price.`,
    "Buyer is unsure about off-plan": `That caution is healthy. Off-plan only works when developer credibility, payment plan, handover timing, escrow/project facts, and exit strategy are acceptable.`,
    "Buyer is worried about service charges": `Service charges can change the real return and ownership cost. We should request the latest statement and compare net yield, not headline yield.`,
  };
  return channel === "call" ? responses[objection] : responses[objection];
}

function expectedObjections(buyer: BuyerProfile, property: PropertyRecord) {
  const list = ["Price versus comparable options"];
  if (!buyer.preferredAreas.includes(property.neighbourhood)) list.push("Location or commute trade-off");
  if (buyer.familySize >= 3) list.push("School access and usable space");
  if (buyer.persona.includes("investor") || buyer.persona.includes("Investor")) list.push("Yield, service charges, and exit liquidity");
  if (property.completionStatus !== "Ready") list.push("Off-plan handover and developer risk");
  return list;
}
