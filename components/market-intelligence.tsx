"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Calculator,
  Check,
  Download,
  Edit3,
  FileText,
  Flame,
  Gauge,
  Hospital,
  Landmark,
  MapPin,
  Plane,
  School,
  ShoppingBag,
  Sparkles,
  Target,
  TrainFront,
  TrendingUp,
  Trees,
  Waves,
} from "lucide-react";
import { UiModal } from "@/components/ui-modal";
import { initialBuyerProfiles } from "@/lib/buyer-data";
import { initialProperties, type PropertyRecord } from "@/lib/property-data";
import {
  buyerSpecificNeighbourhoodFit,
  calculateLifestyleScore,
  calculateUndervaluedDealScore,
  compareListingToMarket,
  estimateRentalYield,
  generateMarketExplanation,
  getAreaBenchmarks,
  getBuildingIntel,
  getCommunityIntel,
  getDeveloperProjectIntel,
  getDldComparables,
  getMarketForecast,
  getMarketHeatmap,
  getMonthlyCommunityReport,
  getNeighbourhoodSummary,
  getPoiProximityAnalysis,
  getTrendingCommunities,
  summarizeComparables,
  type AreaBenchmark,
  type MarketHeatmapCell,
  type NearbyCategory,
} from "@/lib/market-intel";

type Tab = "Communities" | "Buildings" | "Benchmarks" | "Listing Comparison" | "Deal Score" | "Yield" | "POI & Proximity" | "Heatmap" | "Reports" | "Forecast";
type Props = { notify: (message: string) => void };

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const money = (value: number) => `AED ${number.format(value)}`;

export function MarketIntelligence({ notify }: Props) {
  const [tab, setTab] = useState<Tab>("Communities");
  const [purpose, setPurpose] = useState<"buy" | "rent">("buy");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [bedrooms, setBedrooms] = useState("All bedrooms");
  const [selectedArea, setSelectedArea] = useState("Dubai Marina");
  const [propertyId, setPropertyId] = useState(initialProperties[0].id);
  const [detail, setDetail] = useState<AreaBenchmark | null>(null);
  const property = initialProperties.find((item) => item.id === propertyId) ?? initialProperties[0];
  const community = getCommunityIntel(selectedArea);
  const benchmarks = getAreaBenchmarks().filter((item) => item.purpose === purpose && item.propertyType === propertyType && (bedrooms === "All bedrooms" || item.bedroomSegment.includes(bedrooms)));
  const areas = [...new Set(getAreaBenchmarks().map((item) => item.neighbourhood))];
  const buildings = [...new Set(initialProperties.map((item) => item.building).filter(Boolean))];

  return <div className="module-stack market-intel-epic intelligence-v2">
    <section className="market-intel-hero intelligence-hero">
      <div>
        <span><Landmark />AUREST INTELLIGENCE V2 · INT-001 → INT-015</span>
        <h2>Community, building, benchmark, POI, heatmap and forecasting intelligence.</h2>
        <p>All signals are frontend fake/local. DLD, Google Maps and forecasting are API-ready placeholders with visible assumptions.</p>
      </div>
      <button className="primary-button" onClick={() => notify("Aurest Intelligence snapshot prepared for report")}><Download />Export snapshot</button>
    </section>

    <section className="intelligence-kpis">
      <Metric icon={MapPin} label="Community demand" value={`${community.demandScore}/100`} detail={community.trend} />
      <Metric icon={Gauge} label="Median AED/m²" value={`AED ${number.format(community.medianAedPerM2)}`} detail={`${community.listings} benchmark listings`} />
      <Metric icon={Calculator} label="Yield score" value={`${community.yieldScore}/100`} detail="Indicative rent proxy" />
      <Metric icon={Check} label="Verified share" value={`${community.verifiedShare}%`} detail={`${community.newListings} new listings`} />
      <Metric icon={Sparkles} label="Lifestyle score" value={`${community.lifestyleScore}/100`} detail={calculateLifestyleScore(selectedArea).label} />
    </section>

    <div className="market-intel-controls intelligence-controls">
      <label>Community<select value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)}>{areas.map((area) => <option key={area}>{area}</option>)}</select></label>
      <label>Property<select value={propertyId} onChange={(event) => setPropertyId(event.target.value)}>{initialProperties.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      <label>Purpose<select value={purpose} onChange={(event) => setPurpose(event.target.value as "buy" | "rent")}><option value="buy">Sale</option><option value="rent">Rent</option></select></label>
      <label>Type<select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}><option>Apartment</option><option>Villa</option><option>Townhouse</option></select></label>
      <label>Bedrooms<select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}><option>All bedrooms</option><option>Studio</option><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
      <button onClick={() => notify("Methodology notes opened in report-ready format")}><Check />Methodology</button>
    </div>

    <div className="market-intel-tabs intelligence-tabs">{(["Communities", "Buildings", "Benchmarks", "Listing Comparison", "Deal Score", "Yield", "POI & Proximity", "Heatmap", "Reports", "Forecast"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{tabIcon(item)}{item}</button>)}</div>

    {tab === "Communities" && <CommunitiesView area={selectedArea} onArea={setSelectedArea} notify={notify} />}
    {tab === "Buildings" && <BuildingsView buildings={buildings} notify={notify} />}
    {tab === "Benchmarks" && <BenchmarksView benchmarks={benchmarks} onOpen={setDetail} />}
    {tab === "Listing Comparison" && <ListingComparisonView property={property} notify={notify} />}
    {tab === "Deal Score" && <DealScoreView property={property} notify={notify} />}
    {tab === "Yield" && <YieldView property={property} notify={notify} />}
    {tab === "POI & Proximity" && <PoiView area={selectedArea} notify={notify} />}
    {tab === "Heatmap" && <HeatmapView notify={notify} />}
    {tab === "Reports" && <ReportsView area={selectedArea} property={property} notify={notify} />}
    {tab === "Forecast" && <ForecastView area={selectedArea} notify={notify} />}
    {detail && <BenchmarkDetail benchmark={detail} onClose={() => setDetail(null)} />}
  </div>;
}

function CommunitiesView({ area, onArea, notify }: { area: string; onArea: (area: string) => void; notify: (message: string) => void }) {
  const intel = getCommunityIntel(area);
  const summary = getNeighbourhoodSummary(area);
  const lifestyle = calculateLifestyleScore(area);
  return <div className="intelligence-grid">
    <section className="intelligence-panel community-dashboard">
      <PanelTitle icon={<MapPin />} title="INT-001 · Community dashboard" detail={`${area} · ${intel.trend}`} action="Include in report" onAction={() => notify(`${area} community dashboard included in report`)} />
      <div className="community-score-card"><strong>{intel.demandScore}</strong><span>Demand score</span><p>{intel.summary}</p></div>
      <div className="intel-fact-grid">
        <Fact label="Median sale" value={money(intel.medianSale)} />
        <Fact label="Median rent" value={money(intel.medianRent)} />
        <Fact label="Median AED/m²" value={`AED ${number.format(intel.medianAedPerM2)}`} />
        <Fact label="Listings" value={String(intel.listings)} />
        <Fact label="Verified share" value={`${intel.verifiedShare}%`} />
        <Fact label="New listings" value={String(intel.newListings)} />
      </div>
    </section>
    <section className="intelligence-panel">
      <PanelTitle icon={<Flame />} title="INT-007 · Top trending communities" detail="Ranked by fake demand, listings and buyer persona signals" />
      <div className="trending-list">{getTrendingCommunities().map((item) => <button key={item.area} className={item.area === area ? "active" : ""} onClick={() => onArea(item.area)}><strong>#{item.rank} {item.area}</strong><span>{item.momentum}/100 momentum</span><p>{item.reason}</p></button>)}</div>
    </section>
    <section className="intelligence-panel">
      <PanelTitle icon={<Sparkles />} title="INT-010 · Community lifestyle score" detail={lifestyle.guardrail} action="Save summary" onAction={() => notify("Lifestyle score saved locally")} />
      <div className="lifestyle-score"><strong>{lifestyle.score}</strong><span>{lifestyle.label}</span></div>
      {lifestyle.factors.map((factor) => <ScoreLine key={factor.label} label={factor.label} score={factor.score} detail={factor.explanation} />)}
    </section>
    <section className="intelligence-panel">
      <PanelTitle icon={<FileText />} title="Neighbourhood narrative" detail="Editable and buyer-specific report section" />
      <p className="intel-copy">{summary.lifestyle}</p>
      <p className="intel-copy"><strong>Investment:</strong> {summary.investmentAttractiveness}</p>
      <p className="intel-copy"><strong>Guardrail:</strong> {summary.guardrail}</p>
    </section>
  </div>;
}

function BuildingsView({ buildings, notify }: { buildings: string[]; notify: (message: string) => void }) {
  return <div className="intelligence-grid">
    {buildings.map((building) => {
      const intel = getBuildingIntel(building);
      const project = getDeveloperProjectIntel(building);
      return <section className="intelligence-panel building-card" key={building}>
        <PanelTitle icon={<Building2 />} title="INT-002 · Building dashboard" detail={`${intel.community} · ${intel.developer}`} action="Open project intel" onAction={() => notify(`${building} project intelligence opened`)} />
        <h3>{intel.building}</h3>
        <div className="intel-fact-grid">
          <Fact label="Unit mix" value={intel.unitMix} />
          <Fact label="Avg AED/m²" value={`AED ${number.format(intel.averageAedPerM2)}`} />
          <Fact label="Transactions" value={String(intel.transactions)} />
          <Fact label="Listings" value={String(intel.listingCount)} />
          <Fact label="Quality" value={`${intel.qualityScore}/100`} />
          <Fact label="Service charge" value={intel.serviceCharge} />
        </div>
        <div className="project-intel-box"><span>INT-014 · Developer/project intelligence</span><strong>{project.projectQuality}/100 project quality</strong><p>{project.paymentPlan} · {project.handover}</p>{project.riskNotes.map((note) => <em key={note}>{note}</em>)}</div>
      </section>;
    })}
  </div>;
}

function BenchmarksView({ benchmarks, onOpen }: { benchmarks: AreaBenchmark[]; onOpen: (benchmark: AreaBenchmark) => void }) {
  return <section className="benchmark-epic-card">
    <div className="benchmark-epic-head"><span>Neighbourhood</span><span>Median / Avg sale</span><span>Median / Avg rent</span><span>AED/m²</span><span>Sample</span><span>Verified</span><span /></div>
    {benchmarks.map((item) => <button key={`${item.neighbourhood}-${item.purpose}-${item.propertyType}-${item.bedroomSegment}`} className={item.lowSampleWarning ? "benchmark-epic-row low-sample" : "benchmark-epic-row"} onClick={() => onOpen(item)}><span><MapPin />{item.neighbourhood}<small>INT-003 · {item.purpose === "buy" ? "Sale" : "Rent"} · {item.propertyType} · {item.bedroomSegment}</small></span><span>{money(item.medianSalePrice)}<small>Avg {money(item.averageSalePrice)}</small></span><span>{money(item.medianRentPrice)}<small>Avg {money(item.averageRentPrice)}</small></span><span>AED {number.format(item.medianAedPerM2)}</span><span>{item.sampleSize}<small>{item.lowSampleWarning ? "Low sample" : `${item.newListingsCount} new`}</small></span><span>{item.verifiedListingPercentage}%</span>{item.lowSampleWarning ? <AlertTriangle /> : <Check />}</button>)}
    {!benchmarks.length && <div className="market-empty-state"><AlertTriangle /><p>No benchmark sample for this filter yet. Try another bedroom or property type.</p></div>}
  </section>;
}

function ListingComparisonView({ property, notify }: { property: PropertyRecord; notify: (message: string) => void }) {
  const comparison = compareListingToMarket(property);
  const comparables = getDldComparables(property);
  const summary = summarizeComparables(comparables);
  return <div className="intelligence-grid two">
    <section className="intelligence-panel">
      <PanelTitle icon={<Gauge />} title="INT-004 · Listing vs market comparison" detail={comparison.explanation} action="Add comparison to report" onAction={() => notify("Listing comparison added to report")} />
      <div className={`comparison-label ${comparison.label.toLowerCase().replaceAll(" ", "-")}`}>{comparison.label}</div>
      <div className="intel-fact-grid">
        <Fact label="Listing price" value={money(comparison.listingPrice)} />
        <Fact label="Listing AED/m²" value={`AED ${number.format(comparison.listingAedPerM2)}`} />
        <Fact label="Benchmark AED/m²" value={`AED ${number.format(comparison.benchmarkAedPerM2)}`} />
        <Fact label="Delta" value={`${comparison.deltaPercent}%`} />
      </div>
    </section>
    <section className="dld-table-card">
      <PanelTitle icon={<Landmark />} title="Comparable evidence" detail={comparables.length ? `${comparables.length} DLD-style comparable(s)` : "No comparable transactions available"} action="Include comparables" onAction={() => notify(comparables.length ? "Comparables included" : "No comparables to include")} />
      <div className="dld-summary"><div><strong>{comparables.length ? money(summary.averagePrice) : "Not available"}</strong><span>Average sold price</span></div><div><strong>{comparables.length ? `AED ${number.format(summary.averageAedPerM2)}` : "Not available"}</strong><span>Average AED/m²</span></div><div><strong>{summary.sourceDate}</strong><span>Source date</span></div></div>
      {comparables.length ? comparables.map((item) => <div className="dld-row expanded" key={item.id}><span>{new Date(item.transactionDate).toLocaleDateString("en-GB")}<small>{item.transactionType}</small></span><span>{item.area}<small>{item.building}</small></span><span>{item.bedrooms || "Studio"} bed {item.propertyType}<small>{item.matchReason}</small></span><span>{number.format(item.sizeSqFt)} sq ft</span><span>{money(item.soldPrice)}</span><span>AED {number.format(item.pricePerM2)}</span></div>) : <div className="market-empty-state"><AlertTriangle /><p>No comparable transactions available for this property.</p></div>}
    </section>
  </div>;
}

function DealScoreView({ property, notify }: { property: PropertyRecord; notify: (message: string) => void }) {
  const deal = calculateUndervaluedDealScore(property);
  const explanation = generateMarketExplanation(property);
  return <div className="intelligence-grid two">
    <section className="intelligence-panel deal-score-panel">
      <PanelTitle icon={<Target />} title="INT-005 · Undervalued deal score" detail={deal.explanation} action="Include deal score" onAction={() => notify("Undervalued deal score added to report")} />
      <div className="deal-score-display"><strong>{deal.score}</strong><span>{deal.label}</span></div>
      <div className="deal-upside-risk"><article><strong>Main upside</strong><p>{deal.upside}</p></article><article><strong>Main risk</strong><p>{deal.risk}</p></article></div>
      {deal.factors.map((factor) => <ScoreLine key={factor.label} label={factor.label} score={factor.score} detail={factor.detail} />)}
    </section>
    <section className="intelligence-panel">
      <PanelTitle icon={<Sparkles />} title="INT-012 · AI market explanation" detail={explanation.guardrail} action="Save edit" onAction={() => notify("AI market explanation saved locally")} />
      <h3>{explanation.title}</h3>
      <textarea className="market-explanation-editor" defaultValue={`${explanation.body}\n\nRecommendation: ${explanation.recommendation}\n\nRisks:\n- ${explanation.risks.join("\n- ")}`} />
    </section>
  </div>;
}

function YieldView({ property, notify }: { property: PropertyRecord; notify: (message: string) => void }) {
  const estimate = estimateRentalYield(property);
  const [rent, setRent] = useState(estimate.annualRent);
  const editable = estimateRentalYield(property, rent);
  return <section className="yield-estimator-card expanded-yield">
    <PanelTitle icon={<Calculator />} title="INT-006 · Rental yield estimator" detail="Indicative only. Editable expected rent for investor reports." action="Use in investor report" onAction={() => notify("Yield assumption saved for report")} />
    <div className="yield-workbench">
      <label>Expected annual rent<input type="number" value={rent} onChange={(event) => setRent(Number(event.target.value))} /></label>
      <div className="yield-score-large"><strong>{editable.grossYield}%</strong><span>Gross yield</span></div>
      <ul>{editable.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
      {editable.manualOverride && <div className="market-warning"><AlertTriangle />Manual rent override applied</div>}
    </div>
  </section>;
}

function PoiView({ area, notify }: { area: string; notify: (message: string) => void }) {
  const [buyerId, setBuyerId] = useState(initialBuyerProfiles[0].id);
  const [draft, setDraft] = useState("");
  const buyer = initialBuyerProfiles.find((item) => item.id === buyerId) ?? initialBuyerProfiles[0];
  const summary = getNeighbourhoodSummary(area);
  const fit = buyerSpecificNeighbourhoodFit(buyer, area);
  const proximity = getPoiProximityAnalysis(area);
  const copy = draft || `${summary.lifestyle}\n\nBuyer-specific fit:\n${fit}\n\nGuardrail: ${summary.guardrail}`;
  return <div className="nearby-summary-layout">
    <section className="nearby-card">
      <PanelTitle icon={<MapPin />} title="INT-008 / INT-009 · POI & proximity analysis" detail="Schools, malls, metro, beaches and more" action="Add selected POIs" onAction={() => notify("Selected nearby places added to report")} />
      <div className="nearby-grid">{proximity.map((place) => <article key={`${place.category}-${place.nearest}`} className={place.selected ? "selected" : ""}><i>{categoryIcon(place.category)}</i><span>{place.category}</span><strong>{place.nearest}</strong><p>{place.distanceKm} km · {place.minutes} · Score {place.score}</p><small>{place.buyerRelevance}</small></article>)}</div>
    </section>
    <section className="neighbourhood-summary-editor">
      <PanelTitle icon={<Edit3 />} title="Buyer-specific neighbourhood fit" detail="Editable and guardrailed" action="Save edit" onAction={() => { setDraft(copy); notify("Neighbourhood fit saved locally"); }} />
      <label>Buyer persona context<select value={buyerId} onChange={(event) => setBuyerId(event.target.value)}>{initialBuyerProfiles.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.persona}</option>)}</select></label>
      <div className="summary-pill-grid"><span>Persona: {buyer.persona}</span><span>Reasoning included</span><span>Unsupported claims avoided</span></div>
      <textarea value={copy} onChange={(event) => setDraft(event.target.value)} />
    </section>
  </div>;
}

function HeatmapView({ notify }: { notify: (message: string) => void }) {
  const [metric, setMetric] = useState<MarketHeatmapCell["metric"]>("Opportunity");
  const cells = getMarketHeatmap(metric);
  return <section className="intelligence-panel">
    <PanelTitle icon={<Flame />} title="INT-011 · Market heatmap" detail="Visual fake heatmap for demand, yield, growth and opportunity" action="Export heatmap" onAction={() => notify(`${metric} heatmap exported`)} />
    <div className="heatmap-controls">{(["Demand", "Yield", "Price growth", "Opportunity"] as MarketHeatmapCell["metric"][]).map((item) => <button key={item} className={metric === item ? "active" : ""} onClick={() => setMetric(item)}>{item}</button>)}</div>
    <div className="heatmap-grid">{cells.map((cell) => <article key={cell.area} className={cell.label.toLowerCase()}><strong>{cell.score}</strong><span>{cell.area}</span><em>{cell.label}</em><p>{cell.reason}</p></article>)}</div>
  </section>;
}

function ReportsView({ area, property, notify }: { area: string; property: PropertyRecord; notify: (message: string) => void }) {
  const report = getMonthlyCommunityReport(area);
  const project = getDeveloperProjectIntel(property.building);
  return <div className="intelligence-grid two">
    <section className="intelligence-panel">
      <PanelTitle icon={<FileText />} title="INT-013 · Monthly community report" detail={`${report.area} · ${report.month} · source ${report.sourceDate}`} action="Prepare report" onAction={() => notify(`${area} monthly community report prepared`)} />
      {report.sections.map((section) => <div className="monthly-section" key={section.title}><strong>{section.title}</strong><p>{section.content}</p></div>)}
    </section>
    <section className="intelligence-panel">
      <PanelTitle icon={<Building2 />} title="INT-014 · Developer/project intelligence" detail={`${project.project} · ${project.developer}`} action="Include project notes" onAction={() => notify("Developer/project intelligence included")} />
      <div className="intel-fact-grid">
        <Fact label="Community" value={project.community} />
        <Fact label="Handover" value={project.handover} />
        <Fact label="Payment plan" value={project.paymentPlan} />
        <Fact label="Quality" value={`${project.projectQuality}/100`} />
        <Fact label="Inventory" value={String(project.activeInventory)} />
        <Fact label="Benchmark AED/m²" value={`AED ${number.format(project.benchmarkAedPerM2)}`} />
      </div>
      {project.riskNotes.map((note) => <p className="intel-copy" key={note}><AlertTriangle /> {note}</p>)}
    </section>
  </div>;
}

function ForecastView({ area, notify }: { area: string; notify: (message: string) => void }) {
  const forecasts = getMarketForecast(area);
  return <section className="intelligence-panel">
    <PanelTitle icon={<TrendingUp />} title="INT-015 · Forecasting engine" detail="Placeholder forecast with assumptions and confidence" action="Save forecast" onAction={() => notify("Forecast placeholder saved locally")} />
    <div className="forecast-grid">{forecasts.map((forecast) => <article key={forecast.horizon}><span>{forecast.horizon}</span><strong>{forecast.direction}</strong><em>{forecast.confidence}% confidence</em><ul>{forecast.assumptions.map((item) => <li key={item}>{item}</li>)}</ul><p>{forecast.disclaimer}</p></article>)}</div>
  </section>;
}

function BenchmarkDetail({ benchmark, onClose }: { benchmark: AreaBenchmark; onClose: () => void }) {
  return <UiModal title={`${benchmark.neighbourhood} benchmarks`} subtitle={`${benchmark.purpose === "buy" ? "Sale" : "Rent"} · ${benchmark.propertyType} · Source ${benchmark.sourceDate}`} onClose={onClose} size="large">
    <div className="benchmark-detail-modal"><div className="detail-kpis"><div><span>Median sale</span><strong>{money(benchmark.medianSalePrice)}</strong></div><div><span>Average sale</span><strong>{money(benchmark.averageSalePrice)}</strong></div><div><span>Median rent</span><strong>{money(benchmark.medianRentPrice)}</strong></div><div><span>Average rent</span><strong>{money(benchmark.averageRentPrice)}</strong></div><div><span>Median AED/m²</span><strong>AED {number.format(benchmark.medianAedPerM2)}</strong></div><div><span>Average area</span><strong>{number.format(benchmark.averageAreaSqFt)} sq ft</strong></div><div><span>Sample size</span><strong>{benchmark.sampleSize}</strong></div><div><span>Verified share</span><strong>{benchmark.verifiedListingPercentage}%</strong></div></div><div className={benchmark.lowSampleWarning ? "price-range-card warning" : "price-range-card"}><span>Price range · {benchmark.bedroomSegment}</span><strong>{money(benchmark.priceRange[0])} — {money(benchmark.priceRange[1])}</strong><p>{benchmark.listingCount} listings · {benchmark.newListingsCount} new · {benchmark.verifiedListingsCount} verified{benchmark.lowSampleWarning ? " · Low sample size warning" : ""}</p></div></div>
    <div className="form-actions"><button className="primary-button" onClick={onClose}>Done</button></div>
  </UiModal>;
}

function PanelTitle({ icon, title, detail, action, onAction }: { icon: ReactNode; title: string; detail: string; action?: string; onAction?: () => void }) {
  return <div className="section-title intelligence-title"><div><h3>{icon}{title}</h3><p>{detail}</p></div>{action && onAction && <button onClick={onAction}>{action}</button>}</div>;
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof MapPin; label: string; value: string; detail: string }) {
  return <article><Icon /><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value || "Not available"}</strong></div>;
}

function ScoreLine({ label, score, detail }: { label: string; score: number; detail: string }) {
  return <div className="score-line"><span><strong>{label}</strong><small>{detail}</small></span><b>{score}</b><i><u style={{ width: `${Math.min(100, Math.max(0, score))}%` }} /></i></div>;
}

function tabIcon(tab: Tab) {
  const icons: Record<Tab, ReactNode> = {
    Communities: <MapPin />,
    Buildings: <Building2 />,
    Benchmarks: <BarChart3 />,
    "Listing Comparison": <Gauge />,
    "Deal Score": <Target />,
    Yield: <Calculator />,
    "POI & Proximity": <School />,
    Heatmap: <Flame />,
    Reports: <FileText />,
    Forecast: <TrendingUp />,
  };
  return icons[tab];
}

function categoryIcon(category: NearbyCategory) {
  const icons: Record<NearbyCategory, ReactNode> = {
    Schools: <School />,
    Hospitals: <Hospital />,
    Malls: <ShoppingBag />,
    Beaches: <Waves />,
    "Metro stations": <TrainFront />,
    Parks: <Trees />,
    Airports: <Plane />,
    "Business districts": <BriefcaseBusiness />,
  };
  return icons[category] ?? <MapPin />;
}
