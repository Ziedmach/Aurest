"use client";

import { useState } from "react";
import { BarChart3, Check, Download, Eye, FileText, Filter, Flag, MessageCircle, PieChart, Target, Users } from "lucide-react";
import { areaDemandRows, conversionFunnel, mostUsedTemplates, soloBrokerMetrics, teamUsageRows } from "@/lib/analytics-quality";

type Tab = "Solo dashboard" | "Team usage" | "Area demand" | "Conversion";

export function AnalyticsPerformance({ notify }: { notify: (message: string) => void }) {
  const [tab, setTab] = useState<Tab>("Solo dashboard");
  const [range, setRange] = useState("This month");
  return <div className="module-stack analytics-epic">
    <section className="analytics-hero"><div><span><BarChart3 />ANALYTICS & PERFORMANCE</span><h2>Simple broker performance with team and conversion views</h2><p>Track activity without overload: personal production, broker comparison, area demand and impact funnel.</p></div><button className="primary-button" onClick={() => notify("Analytics export prepared")}><Download />Export</button></section>
    <div className="analytics-controls"><label><Filter />Date range<select value={range} onChange={(event) => setRange(event.target.value)}><option>Today</option><option>Last 7 days</option><option>This month</option><option>This quarter</option></select></label><span><Check />Workspace-scoped analytics · {range}</span></div>
    <div className="analytics-tabs">{(["Solo dashboard", "Team usage", "Area demand", "Conversion"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "Solo dashboard" ? <Users /> : item === "Team usage" ? <BarChart3 /> : item === "Area demand" ? <PieChart /> : <Target />}{item}</button>)}</div>
    {tab === "Solo dashboard" && <SoloDashboard notify={notify} />}
    {tab === "Team usage" && <TeamUsage notify={notify} />}
    {tab === "Area demand" && <AreaDemand notify={notify} />}
    {tab === "Conversion" && <ConversionTracking notify={notify} />}
  </div>;
}

function SoloDashboard({ notify }: { notify: (message: string) => void }) {
  const metrics = soloBrokerMetrics();
  return <div className="solo-analytics-layout">
    <div className="solo-kpis"><Kpi icon={Users} label="Active buyers" value={metrics.activeBuyers} detail={`${metrics.newBuyersThisMonth} new this month`} /><Kpi icon={FileText} label="Reports generated" value={metrics.reportsGenerated} detail={`${metrics.reportsThisMonth} this month`} /><Kpi icon={Target} label="Shortlisted" value={metrics.propertiesShortlisted} detail="Across active buyers" /><Kpi icon={MessageCircle} label="Follow-ups" value={metrics.followUpsCreated} detail="Sales content assisted" /><Kpi icon={Flag} label="Reports remaining" value={metrics.usageLimitRemaining} detail="Usage limit" /><Kpi icon={Eye} label="New matches" value={metrics.newPropertyMatches} detail="From saved searches" /></div>
    <section className="analytics-card solo-action-card"><h3>Next best actions</h3>{metrics.nextActions.map((item) => <button key={item} onClick={() => notify(item)}><Check />{item}</button>)}</section>
    <section className="analytics-card solo-activity-card"><h3>Recent buyer activity</h3>{metrics.recentActivities.map((item) => <p key={item}>{item}</p>)}</section>
    <section className="analytics-card"><h3>Most active buyer personas</h3>{metrics.topPersonas.map(([persona, count]) => <BarRow key={persona} label={persona} value={count} max={3} />)}</section>
    <section className="analytics-card"><h3>Most used areas</h3>{metrics.topAreas.map(([area, count]) => <BarRow key={area} label={area} value={count} max={3} />)}</section>
  </div>;
}

function TeamUsage({ notify }: { notify: (message: string) => void }) {
  const rows = teamUsageRows();
  const templates = mostUsedTemplates();
  const [broker, setBroker] = useState("All brokers");
  const visible = rows.filter((row) => broker === "All brokers" || row.name === broker);
  const totals = visible.reduce((sum, row) => ({ reports: sum.reports + row.reports, buyers: sum.buyers + row.buyers, messages: sum.messages + row.messages, followUps: sum.followUps + row.followUps }), { reports: 0, buyers: 0, messages: 0, followUps: 0 });
  return <div className="team-usage-layout"><section className="analytics-card team-filter-card"><h3>Team filters</h3><label>Broker<select value={broker} onChange={(event) => setBroker(event.target.value)}><option>All brokers</option>{rows.map((row) => <option key={row.name}>{row.name}</option>)}</select></label><p>Manager view is limited to assigned team; admin can compare the full workspace.</p><button className="primary-button" onClick={() => notify("Team usage export prepared")}>Export dashboard data</button></section><section className="team-usage-table"><div className="team-usage-summary"><span>Reports {totals.reports}</span><span>Buyers {totals.buyers}</span><span>WhatsApp {totals.messages}</span><span>Follow-ups {totals.followUps}</span><span>Public links 9</span></div><div className="team-usage-head"><span>Broker</span><span>Reports</span><span>Buyers</span><span>WhatsApp</span><span>Follow-ups</span><span>Active</span><span>Won/Lost</span><span>Top template</span></div>{visible.map((row) => <div className="team-usage-row" key={row.name}><span>{row.name}</span><strong>{row.reports}</strong><strong>{row.buyers}</strong><strong>{row.messages}</strong><strong>{row.followUps}</strong><strong>{row.activeBuyers}</strong><span>{row.won}/{row.lost}</span><em>{row.templates}</em></div>)}</section><section className="analytics-card"><h3>Most used templates</h3>{templates.map((item) => <BarRow key={item.name} label={item.name} value={item.count} max={18} />)}</section></div>;
}

function AreaDemand({ notify }: { notify: (message: string) => void }) {
  const rows = areaDemandRows();
  const [segment, setSegment] = useState("All demand");
  const visible = rows.filter((row) => segment === "All demand" || row.purpose === segment);
  return <section className="area-demand-card"><div className="area-demand-toolbar"><label>Demand type<select value={segment} onChange={(event) => setSegment(event.target.value)}><option>All demand</option><option>Buy</option><option>Rent</option></select></label><label>Broker/team<select><option>All brokers</option><option>Zied team</option><option>Maya team</option></select></label><button onClick={() => notify("Area demand insights exported")}>Export</button></div><div className="area-demand-head"><span>Area</span><span>Requested</span><span>Recommended</span><span>Reported</span><span>Budget</span><span>Persona</span><span>Type</span><span>Beds</span><span>Buy/rent</span></div>{visible.map((row) => <div className="area-demand-row" key={row.area}><strong>{row.area}<small>{row.lowSample ? "Low sample" : "Healthy sample"}</small></strong><span>{row.requested}</span><span>{row.recommended}</span><span>{row.reported}</span><small>{row.budget}</small><em>{row.persona}</em><span>{row.propertyType}</span><span>{row.bedrooms}</span><span>{row.purpose}</span></div>)}</section>;
}

function ConversionTracking({ notify }: { notify: (message: string) => void }) {
  const [outcome, setOutcome] = useState("Viewing booked");
  const funnel = conversionFunnel();
  const max = funnel[0].count;
  return <div className="conversion-layout"><section className="conversion-funnel">{funnel.map((item) => <article key={item.stage}><div><span>{item.stage}</span><strong>{item.count}</strong></div><i style={{ width: `${item.count / max * 100}%` }} /></article>)}</section><section className="conversion-update-card"><Eye /><h3>Manual outcome update</h3><p>Public report views can be tracked automatically later; broker can update funnel outcome manually now.</p><label>Outcome<select value={outcome} onChange={(event) => setOutcome(event.target.value)}><option>Report sent</option><option>Buyer opened report</option><option>Follow-up sent</option><option>Viewing booked</option><option>Deal won</option><option>Deal lost</option></select></label><button className="primary-button" onClick={() => notify(`Outcome updated: ${outcome}`)}>Update impact metric</button></section></div>;
}

function Kpi({ icon: Icon, label, value, detail }: { icon: typeof Users; label: string; value: number; detail: string }) { return <article><i><Icon /></i><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
function BarRow({ label, value, max }: { label: string; value: number; max: number }) { return <div className="analytics-bar-row"><span>{label}</span><strong>{value}</strong><i><b style={{ width: `${Math.min(100, value / max * 100)}%` }} /></i></div>; }
