"use client";

import { useState } from "react";
import { AlertTriangle, Check, FileText, Lock, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import type { Workspace } from "@/lib/workspace";

type Tab = "Sensitive data guardrails" | "Disclaimers" | "AI review mode";
type DisclaimerKey = "Market data" | "AI-generated content" | "Investment" | "Data freshness" | "Agency-specific";

const riskyExamples = [
  "Infer buyer religion or family status from social media",
  "Guarantee capital appreciation or rental yield",
  "Recommend areas based on protected attributes",
  "Scrape private buyer profiles without consent",
];

const safeRules = [
  "Use buyer-provided, broker-provided, public, or consented information only",
  "Keep recommendations focused on property needs, budget, commute, lifestyle and investment context",
  "Avoid unsupported claims about private life, identity or certainty of outcome",
  "Rewrite risky prompts into neutral property-advisory language",
];

export function ComplianceGuardrails({ workspace, notify }: { workspace: Workspace; notify: (message: string) => void }) {
  const [tab, setTab] = useState<Tab>("Sensitive data guardrails");
  return <div className="module-stack compliance-epic">
    <section className="compliance-hero"><div><span><ShieldCheck />COMPLIANCE, PRIVACY & GUARDRAILS</span><h2>Safe AI output, disclaimers and agency review controls</h2><p>Keep buyer enrichment, reports and sales content professional, consent-aware and free from risky personal profiling.</p></div><button className="primary-button" onClick={() => notify("Compliance health check completed")}>Run check</button></section>
    <div className="compliance-tabs">{(["Sensitive data guardrails", "Disclaimers", "AI review mode"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "Sensitive data guardrails" ? <ShieldCheck /> : item === "Disclaimers" ? <FileText /> : <UserCheck />}{item}</button>)}</div>
    {tab === "Sensitive data guardrails" && <GuardrailView notify={notify} />}
    {tab === "Disclaimers" && <DisclaimerView workspace={workspace} notify={notify} />}
    {tab === "AI review mode" && <ReviewModeView notify={notify} />}
  </div>;
}

function GuardrailView({ notify }: { notify: (message: string) => void }) {
  const [prompt, setPrompt] = useState("Use the buyer's LinkedIn bio to explain only buying-relevant professional context and avoid personal assumptions.");
  const risky = riskyExamples.some((item) => prompt.toLowerCase().includes(item.split(" ")[0].toLowerCase()) && prompt.toLowerCase().includes("guarantee"));
  return <div className="guardrail-layout"><section className="guardrail-card"><h3>Prompt guardrails</h3><p>Risky or invasive requests are blocked or rewritten before AI generation.</p><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} /><div className={risky ? "guardrail-result risky" : "guardrail-result"}>{risky ? <AlertTriangle /> : <Check />}<span><strong>{risky ? "Rewrite required" : "Safe to generate"}</strong>{risky ? "Remove guarantees and sensitive assumptions before output." : "Focused on consented/property-relevant context."}</span></div><button className="primary-button" onClick={() => notify(risky ? "Risky prompt rewritten into compliant wording" : "Guardrail check logged")}>{risky ? "Rewrite prompt" : "Log guardrail check"}</button></section><section className="guardrail-rules"><h3>Blocked examples</h3>{riskyExamples.map((item) => <div key={item}><AlertTriangle />{item}</div>)}<h3>Allowed rules</h3>{safeRules.map((item) => <div key={item} className="safe"><Check />{item}</div>)}</section></div>;
}

function DisclaimerView({ workspace, notify }: { workspace: Workspace; notify: (message: string) => void }) {
  const [locked, setLocked] = useState(workspace.type === "agency");
  const [template, setTemplate] = useState("All templates");
  const [disclaimers, setDisclaimers] = useState<Record<DisclaimerKey, string>>({
    "Market data": "Market data is based on available listings and comparable signals and should be verified with official sources.",
    "AI-generated content": "AI-generated sections are advisory drafts and require broker review before sharing.",
    "Investment": "Rental yield, appreciation and transaction outcomes are indicative only and not guaranteed.",
    "Data freshness": "Listing availability, price and property details may change and should be revalidated before decision.",
    "Agency-specific": workspace.disclaimer,
  });
  return <div className="disclaimer-layout"><section className="disclaimer-editor"><div className="section-title"><div><h3>Report disclaimer management</h3><p>Disclaimers appear in PDF reports and public report links. They can be template-specific.</p></div><button className={locked ? "active" : ""} onClick={() => { setLocked(!locked); notify("Disclaimer lock updated"); }}><Lock />{locked ? "Locked" : "Unlocked"}</button></div><label>Template scope<select value={template} onChange={(event) => setTemplate(event.target.value)}><option>All templates</option><option>Investor report</option><option>Family relocation report</option><option>Off-plan report</option><option>Short recommendation report</option></select></label>{(Object.keys(disclaimers) as DisclaimerKey[]).map((key) => <label key={key}>{key}<textarea disabled={locked && key === "Agency-specific"} value={disclaimers[key]} onChange={(event) => setDisclaimers({ ...disclaimers, [key]: event.target.value })} /></label>)}<button className="primary-button" onClick={() => notify(`${template} disclaimers saved and audit logged`)}>Save disclaimers</button></section><aside className="disclaimer-preview"><FileText /><h3>Client-facing preview</h3>{Object.entries(disclaimers).map(([key, value]) => <p key={key}><strong>{key}:</strong> {value}</p>)}</aside></div>;
}

function ReviewModeView({ notify }: { notify: (message: string) => void }) {
  const [brokerApproval, setBrokerApproval] = useState(true);
  const [managerApproval, setManagerApproval] = useState(false);
  const [status, setStatus] = useState("Draft · broker review required");
  return <div className="review-mode-layout"><section className="review-config-card"><h3>AI output review mode</h3><p>Agencies can require broker and optional manager approval before export or public link sharing.</p><label><span><strong>Broker approval required</strong><small>Generated report remains draft until broker approves.</small></span><button className={brokerApproval ? "toggle on" : "toggle"} onClick={() => setBrokerApproval(!brokerApproval)}><i /></button></label><label><span><strong>Manager approval required</strong><small>Optional agency workflow before client sharing.</small></span><button className={managerApproval ? "toggle on" : "toggle"} onClick={() => setManagerApproval(!managerApproval)}><i /></button></label><button className="primary-button" onClick={() => { setStatus(managerApproval ? "Waiting for manager approval" : "Ready to share"); notify("Approval action logged"); }}>Approve current draft</button></section><section className="approval-flow-card"><h3>Approval status</h3><div><Sparkles /><span><strong>Report generated</strong><small>AI draft created</small></span><Check /></div><div><UserCheck /><span><strong>Broker review</strong><small>{brokerApproval ? "Required before export" : "Optional"}</small></span><Check /></div><div className={managerApproval ? "" : "muted"}><Lock /><span><strong>Manager approval</strong><small>{managerApproval ? "Required before public sharing" : "Not required"}</small></span>{managerApproval ? <AlertTriangle /> : <Check />}</div><footer>{status}</footer></section></div>;
}
