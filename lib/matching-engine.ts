import type { BuyerProfile } from "./buyer-data";
import type { PropertyRecord } from "./property-data";
import { dataQualityScore, listingFreshness } from "./analytics-quality";

export type FitLabel = "Excellent" | "Good" | "Partial" | "Mismatch";
export type FitCategory = { key: string; label: string; score: number; max: number; fit: FitLabel; explanation: string };
export type DealFactor = { label: string; score: number; explanation: string };
export type DealLabel = "Weak" | "Fair" | "Good" | "Strong" | "Excellent";
export type ExplainableMatch = {
  id: string;
  buyerId: string;
  propertyId: string;
  score: number;
  originalScore: number;
  overridden: boolean;
  overrideReason: string;
  hidden: boolean;
  shortlisted: boolean;
  reasons: string[];
  mismatches: string[];
  matrix: FitCategory[];
  dealScore: number;
  dealLabel: DealLabel;
  dealUpside: string;
  dealRisk: string;
  dealExplanation: string;
  dealFactors: DealFactor[];
};

const weights = { budget:15, area:12, propertyType:7, bedrooms:8, school:7, commute:7, lifestyle:8, investment:9, completion:7, paymentPlan:7, yield:7, benchmark:6 } as const;

export function scoreBuyerProperty(buyer: BuyerProfile, property: PropertyRecord): ExplainableMatch {
  const categories: FitCategory[] = [];
  const price = property.price;
  const inBudget = price >= buyer.budgetMin && price <= buyer.budgetMax;
  const distance = price < buyer.budgetMin ? (buyer.budgetMin-price)/Math.max(buyer.budgetMin,1) : price > buyer.budgetMax ? (price-buyer.budgetMax)/Math.max(buyer.budgetMax,1) : 0;
  add(categories,"budget","Budget fit",inBudget?weights.budget:Math.max(0,Math.round(weights.budget*(1-distance*2.5))),weights.budget,inBudget?"Inside the buyer’s approved range.":price>buyer.budgetMax?`${Math.round(distance*100)}% above the maximum budget.`:"Below target range; verify quality and positioning.");
  const areaFit = buyer.preferredAreas.some((area)=>sameArea(area,property.neighbourhood));
  add(categories,"area","Area fit",areaFit?weights.area:Math.round(weights.area*.35),weights.area,areaFit?`${property.neighbourhood} is explicitly preferred.`:`${property.neighbourhood} is outside the preferred-area list.`);
  const typeFit = buyer.propertyTypes.some((type)=>type.toLowerCase()===property.propertyType.toLowerCase());
  add(categories,"propertyType","Property type fit",typeFit?weights.propertyType:Math.round(weights.propertyType*.25),weights.propertyType,typeFit?`Exact ${property.propertyType.toLowerCase()} fit.`:`Buyer requested ${buyer.propertyTypes.join(" or ").toLowerCase()}.`);
  const bedroomDiff=Math.abs((property.rooms??0)-buyer.bedrooms);
  add(categories,"bedrooms","Bedroom fit",bedroomDiff===0?weights.bedrooms:bedroomDiff===1?Math.round(weights.bedrooms*.55):0,weights.bedrooms,bedroomDiff===0?`Exact ${buyer.bedrooms || "studio"}-bedroom match.`:`${property.rooms??0} bedrooms versus ${buyer.bedrooms} requested.`);
  const lifestyleText=`${buyer.lifestylePreferences} ${property.amenities.join(" ")} ${property.description}`.toLowerCase();
  const lifestyleHits=["gym","pool","walk","water","park","metro","furnished","view"].filter((term)=>lifestyleText.includes(term)).length;
  add(categories,"lifestyle","Lifestyle fit",Math.min(weights.lifestyle,3+lifestyleHits),weights.lifestyle,lifestyleHits>=3?"Several lifestyle signals align with the brief.":"Limited evidence for the requested lifestyle preferences.");
  const schoolRequired=buyer.schoolNeeds.trim() && buyer.schoolNeeds.toLowerCase()!=="not required";
  const familyArea=["dubai hills","arabian ranches","tilal al ghaf","jvc"].some((area)=>property.neighbourhood.toLowerCase().includes(area));
  add(categories,"school","School fit",!schoolRequired?weights.school:familyArea?weights.school:Math.round(weights.school*.3),weights.school,!schoolRequired?"School proximity is not required.":familyArea?"Family community with relevant school access.":"School proximity needs manual validation.");
  const commuteRelevant=buyer.workLocation.trim().length>0;
  const central=["difc","downtown","business bay","marina"].some((area)=>`${buyer.workLocation} ${property.neighbourhood}`.toLowerCase().includes(area));
  add(categories,"commute","Commute fit",!commuteRelevant?weights.commute:central?weights.commute:Math.round(weights.commute*.45),weights.commute,!commuteRelevant?"No work-location constraint supplied.":central?`Relevant access for ${buyer.workLocation}.`:`Commute to ${buyer.workLocation} needs validation.`);
  const investor=buyer.persona.toLowerCase().includes("investor");
  const investmentFit=investor ? (property.estimatedYield??0)>=6 || property.completionStatus==="Off-plan" : true;
  add(categories,"investment","Investment fit",investmentFit?weights.investment:Math.round(weights.investment*.4),weights.investment,investor?(property.estimatedYield??0)>=6?`${property.estimatedYield}% estimated yield supports the objective.`:property.completionStatus==="Off-plan"?"Off-plan structure aligns with appreciation intent.":"Return case is weaker than the stated objective.":"The property supports an end-user-led objective.");
  const wantsOffPlan=buyer.persona==="Off-plan investor"||buyer.investmentObjective.toLowerCase().includes("off-plan");
  const completionFit=wantsOffPlan?property.completionStatus==="Off-plan":property.completionStatus==="Ready";
  add(categories,"completion","Completion status fit",completionFit?weights.completion:Math.round(weights.completion*.45),weights.completion,completionFit?`${property.completionStatus} status matches the buyer timeline.`:`${property.completionStatus} may conflict with timeline or strategy.`);
  const hasPaymentPlan = Boolean(property.paymentPlan && property.paymentPlan !== "Not provided");
  const paymentUseful = wantsOffPlan || investor;
  add(categories,"paymentPlan","Payment plan fit",!paymentUseful?Math.round(weights.paymentPlan*.75):hasPaymentPlan?weights.paymentPlan:Math.round(weights.paymentPlan*.25),weights.paymentPlan,!paymentUseful?"Payment plan is secondary for this buyer.":hasPaymentPlan?`${property.paymentPlan} supports affordability discussion.`:"Payment plan is missing and should be checked.");
  const yieldValue=property.estimatedYield??0;
  add(categories,"yield","Rental yield fit",!investor?weights.yield:yieldValue>=6.2?weights.yield:yieldValue>=5.5?Math.round(weights.yield*.7):Math.round(weights.yield*.3),weights.yield,!investor?"Yield is secondary for this buyer.":yieldValue?`${yieldValue}% estimated gross yield.`:"Yield estimate is unavailable.");
  const priceSqFt=property.price/Math.max(property.areaSqFt,1);
  const benchmark=areaBenchmark(property.neighbourhood);
  const discount=(benchmark-priceSqFt)/benchmark;
  add(categories,"benchmark","Price benchmark fit",discount>=.03?weights.benchmark:discount>=-.05?Math.round(weights.benchmark*.75):Math.round(weights.benchmark*.3),weights.benchmark,`${priceSqFt.toLocaleString("en-US",{maximumFractionDigits:0})} AED/sq ft versus ${benchmark.toLocaleString()} area benchmark.`);
  const score=Math.max(0,Math.min(100,categories.reduce((sum,item)=>sum+item.score,0)));
  const deal=scoreDeal(property,benchmark);
  return { id:`${buyer.id}_${property.id}`,buyerId:buyer.id,propertyId:property.id,score,originalScore:score,overridden:false,overrideReason:"",hidden:false,shortlisted:false,reasons:categories.filter((item)=>item.fit==="Excellent").slice(0,4).map((item)=>item.explanation),mismatches:categories.filter((item)=>item.fit==="Mismatch"||item.fit==="Partial").slice(0,4).map((item)=>item.explanation),matrix:categories,dealScore:deal.score,dealLabel:deal.label,dealUpside:deal.upside,dealRisk:deal.risk,dealExplanation:deal.explanation,dealFactors:deal.factors };
}

export function rankBuyerProperties(buyer:BuyerProfile,properties:PropertyRecord[]){return properties.map((property)=>scoreBuyerProperty(buyer,property)).sort((a,b)=>b.score-a.score);}

export function scoreDeal(property:PropertyRecord,benchmark=areaBenchmark(property.neighbourhood)):{score:number;label:DealLabel;upside:string;risk:string;explanation:string;factors:DealFactor[]} {
  const priceSqFt=property.price/Math.max(property.areaSqFt,1); const discount=(benchmark-priceSqFt)/benchmark;
  const freshness = listingFreshness(property);
  const quality = dataQualityScore(property);
  const demand = buyerDemandScore(property.neighbourhood);
  const factors:DealFactor[]=[
    {label:"Price vs neighbourhood",score:discount>=.08?15:discount>=0?12:discount>=-.07?8:4,explanation:`${discount>=0?Math.round(discount*100)+"% below":Math.abs(Math.round(discount*100))+"% above"} listing benchmark.`},
    {label:"DLD comparable price",score:discount>=.03?14:discount>=-.05?10:6,explanation:"Illustrative DLD comparable band used for frontend demo."},
    {label:"Rental yield",score:(property.estimatedYield??0)>=6.5?14:(property.estimatedYield??0)>=5.5?10:6,explanation:property.estimatedYield?`${property.estimatedYield}% estimated gross yield.`:"Yield unavailable."},
    {label:"Listing freshness",score:freshness.label==="New"?12:freshness.label==="Fresh"?10:freshness.label==="Active"?7:freshness.label==="Unknown"?4:2,explanation:`${freshness.label}: ${freshness.reasons[0] ?? "freshness unavailable"}.`},
    {label:"Verification status",score:property.verified?10:3,explanation:property.verified?"Portal verification signal present.":"Listing is not verified."},
    {label:"Data quality",score:quality>=90?10:quality>=75?8:quality>=60?5:2,explanation:`${quality}% internal listing completeness.`},
    {label:"Buyer demand",score:demand,explanation:`Workspace demand signal for ${property.neighbourhood}.`},
    {label:"Completion",score:property.completionStatus==="Ready"?8:6,explanation:`${property.completionStatus} listing.`},
    {label:"Project reputation",score:8,explanation:property.developer?`${property.developer} project profile available.`:"Developer signal requires validation."},
    {label:"Payment plan",score:property.paymentPlan&&property.paymentPlan!=="Not provided"?9:4,explanation:property.paymentPlan||"No payment plan supplied."},
  ];
  const score = Math.min(100,factors.reduce((sum,item)=>sum+item.score,0));
  const label = dealLabel(score);
  const upside = discount >= 0.03 ? "Pricing appears below the local benchmark." : (property.estimatedYield??0) >= 6.2 ? "Yield profile is the strongest commercial signal." : "Buyer demand and usable project data support the case.";
  const risk = freshness.label === "Stale" ? "Freshness risk: listing may need revalidation." : quality < 75 ? "Data quality risk: missing fields weaken report confidence." : discount < -0.07 ? "Pricing sits above benchmark; negotiation evidence is needed." : "Normal market validation still required before pitching.";
  return {score,label,upside,risk,explanation:`${label} deal score based on benchmark, DLD proxy, yield, freshness, verification, data quality, payment terms, completion and buyer demand.`,factors};
}

function add(list:FitCategory[],key:string,label:string,score:number,max:number,explanation:string){const ratio=score/max;list.push({key,label,score,max,fit:ratio>=.85?"Excellent":ratio>=.65?"Good":ratio>=.35?"Partial":"Mismatch",explanation});}
function sameArea(a:string,b:string){const left=a.toLowerCase().replace(" estate","").replace(" dubai","");const right=b.toLowerCase().replace(" estate","").replace(" dubai","");return left.includes(right)||right.includes(left);}
function areaBenchmark(area:string){const name=area.toLowerCase();if(name.includes("marina"))return 2400;if(name.includes("hills"))return 2200;if(name.includes("downtown"))return 3000;if(name.includes("creek"))return 2050;if(name.includes("jvc"))return 1400;return 2000;}
function buyerDemandScore(area:string){const name=area.toLowerCase();if(name.includes("marina"))return 8;if(name.includes("hills"))return 9;if(name.includes("downtown"))return 7;if(name.includes("creek"))return 6;if(name.includes("jvc"))return 6;return 5;}
function dealLabel(score:number):DealLabel{return score>=85?"Excellent":score>=75?"Strong":score>=62?"Good":score>=45?"Fair":"Weak";}
