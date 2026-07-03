"use client";

import { useMemo, useState } from "react";
import { Check, ClipboardList, Copy, Languages, Lock, Play, RefreshCcw, Save, Settings2, Sparkles, Undo2 } from "lucide-react";
import { initialPromptAuditLogs, initialPromptTemplates, promptTypes, runPromptTest, type PromptAuditLog, type PromptTemplate, type PromptType } from "@/lib/prompt-management";
import { reportTemplates, type ReportTemplateId } from "@/lib/report-data";
import { salesLanguages, salesTones, type SalesLanguage, type SalesTone } from "@/lib/sales-content";
import type { Workspace, WorkspaceContentDefaults } from "@/lib/workspace";

type Tab = "Prompt library" | "Workspace defaults";

export function AIContentManagement({ workspace, onWorkspaceChange, notify }: { workspace: Workspace; onWorkspaceChange: (workspace: Workspace) => void; notify: (message: string) => void }) {
  const [tab, setTab] = useState<Tab>("Prompt library");
  return <div className="module-stack ai-content-epic">
    <section className="ai-content-hero"><div><span><Sparkles />AI PROMPT & CONTENT MANAGEMENT</span><h2>Prompt templates, versioning and workspace output defaults</h2><p>Platform owner can manage generation prompts, while workspace admins control language, tone, report style and override policy.</p></div><button className="primary-button" onClick={() => notify("AI content settings health check completed")}>Run check</button></section>
    <div className="ai-content-tabs">{(["Prompt library", "Workspace defaults"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "Prompt library" ? <ClipboardList /> : <Settings2 />}{item}</button>)}</div>
    {tab === "Prompt library" && <PromptLibrary notify={notify} />}
    {tab === "Workspace defaults" && <WorkspaceDefaults workspace={workspace} onWorkspaceChange={onWorkspaceChange} notify={notify} />}
  </div>;
}

function PromptLibrary({ notify }: { notify: (message: string) => void }) {
  const [templates, setTemplates] = useState(initialPromptTemplates);
  const [logs, setLogs] = useState<PromptAuditLog[]>(initialPromptAuditLogs);
  const [type, setType] = useState<PromptType | "All prompt types">("All prompt types");
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const selected = templates.find((item) => item.id === selectedId) ?? templates[0];
  const [draft, setDraft] = useState(selected.versions.find((item) => item.version === selected.activeVersion)?.body ?? "");
  const [sample, setSample] = useState(selected.testSample);
  const [testResult, setTestResult] = useState("");
  const visible = useMemo(() => templates.filter((item) => type === "All prompt types" || item.type === type), [templates, type]);

  function select(template: PromptTemplate) {
    setSelectedId(template.id);
    setDraft(template.versions.find((item) => item.version === template.activeVersion)?.body ?? "");
    setSample(template.testSample);
    setTestResult("");
  }

  function log(action: PromptAuditLog["action"], template: PromptTemplate, detail: string) {
    setLogs((items) => [{ id: `prompt_log_${Date.now()}`, action, promptId: template.id, promptTitle: template.title, user: "Platform Owner", date: "Just now", detail }, ...items]);
  }

  function savePrompt() {
    const nextVersion = `v1.${selected.versions.length + 1}`;
    setTemplates((items) => items.map((item) => item.id === selected.id ? { ...item, activeVersion: nextVersion, updatedAt: "Just now", versions: [{ id: `ver_${Date.now()}`, version: nextVersion, body: draft, createdAt: "Just now", createdBy: "Platform Owner", note: "Edited in prompt library" }, ...item.versions] } : item));
    log("Edited", selected, `${selected.title} saved as ${nextVersion}`);
    notify("Prompt version saved and change logged");
  }

  function testPrompt() {
    const output = runPromptTest({ ...selected, versions: [{ ...selected.versions[0], body: draft }, ...selected.versions.slice(1)] }, sample);
    setTestResult(output);
    log("Tested", selected, "Tested on sample buyer/property data");
    notify("Prompt tested on sample data");
  }

  function restore(version: string) {
    const versionBody = selected.versions.find((item) => item.version === version)?.body ?? draft;
    setDraft(versionBody);
    setTemplates((items) => items.map((item) => item.id === selected.id ? { ...item, activeVersion: version, updatedAt: "Just now" } : item));
    log("Restored", selected, `Restored ${version}`);
    notify(`${selected.title} restored to ${version}`);
  }

  return <div className="prompt-library-layout">
    <section className="prompt-list-card"><div className="prompt-filter"><label>Prompt type<select value={type} onChange={(event) => setType(event.target.value as PromptType | "All prompt types")}><option>All prompt types</option>{promptTypes.map((item) => <option key={item}>{item}</option>)}</select></label></div>{visible.map((template) => <button key={template.id} className={selected.id === template.id ? "active" : ""} onClick={() => select(template)}><Sparkles /><span><strong>{template.title}</strong><small>{template.type} · {template.activeVersion} · {template.updatedAt}</small></span>{template.locked && <Lock />}</button>)}</section>
    <section className="prompt-editor-card"><header><div><span>PROMPT TEMPLATE</span><h3>{selected.title}</h3><p>{selected.description}</p></div><em>{selected.activeVersion}</em></header><textarea value={draft} onChange={(event) => setDraft(event.target.value)} /><div className="prompt-actions"><button onClick={savePrompt}><Save />Save new version</button><button onClick={testPrompt}><Play />Test prompt</button><button onClick={() => { navigator.clipboard?.writeText(draft); notify("Prompt copied"); }}><Copy />Copy</button></div><div className="prompt-test-panel"><label>Sample data<textarea value={sample} onChange={(event) => setSample(event.target.value)} /></label><pre>{testResult || "Run a test to preview structured output with guardrails."}</pre></div></section>
    <aside className="prompt-version-card"><h3>Versions</h3>{selected.versions.map((version) => <article key={version.id}><strong>{version.version}</strong><span>{version.createdAt} · {version.createdBy}</span><p>{version.note}</p><button onClick={() => restore(version.version)}><Undo2 />Restore</button></article>)}<h3>Change logs</h3>{logs.filter((item) => item.promptId === selected.id).map((item) => <article key={item.id} className="log"><strong>{item.action}</strong><span>{item.date} · {item.user}</span><p>{item.detail}</p></article>)}</aside>
  </div>;
}

function WorkspaceDefaults({ workspace, onWorkspaceChange, notify }: { workspace: Workspace; onWorkspaceChange: (workspace: Workspace) => void; notify: (message: string) => void }) {
  const [draft, setDraft] = useState<WorkspaceContentDefaults>(workspace.contentDefaults);
  const locked = draft.agencyLocksDefaults;
  function set<K extends keyof WorkspaceContentDefaults>(key: K, value: WorkspaceContentDefaults[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }
  return <div className="workspace-defaults-layout"><section className="defaults-editor-card"><div className="section-title"><div><h3>Workspace tone defaults</h3><p>Defaults apply to report generation and Sales Copilot messages. Broker override depends on workspace policy.</p></div><button className={locked ? "active" : ""} onClick={() => set("agencyLocksDefaults", !locked)}><Lock />{locked ? "Locked" : "Unlocked"}</button></div><div className="defaults-grid"><label><Languages />Default language<select value={draft.defaultLanguage} onChange={(event) => set("defaultLanguage", event.target.value as SalesLanguage)} disabled={locked && workspace.type === "agency"}>{salesLanguages.map((item) => <option key={item}>{item}</option>)}</select></label><label><Sparkles />Default tone<select value={draft.defaultTone} onChange={(event) => set("defaultTone", event.target.value as SalesTone)} disabled={locked && workspace.type === "agency"}>{salesTones.map((item) => <option key={item}>{item}</option>)}</select></label><label>Default report style<select value={draft.defaultReportStyle} onChange={(event) => set("defaultReportStyle", event.target.value as WorkspaceContentDefaults["defaultReportStyle"])}><option value="premium">Premium</option><option value="minimal">Minimal</option><option value="editorial">Editorial</option></select></label><label>Default message length<select value={draft.defaultMessageLength} onChange={(event) => set("defaultMessageLength", event.target.value as WorkspaceContentDefaults["defaultMessageLength"])}><option>Short</option><option>Balanced</option><option>Detailed</option></select></label><label>Default report template<select value={draft.defaultReportTemplate} onChange={(event) => set("defaultReportTemplate", event.target.value as ReportTemplateId)}>{reportTemplates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}</select></label><label>Broker overrides<select value={draft.brokerCanOverride ? "Allowed" : "Blocked"} onChange={(event) => set("brokerCanOverride", event.target.value === "Allowed")}><option>Allowed</option><option>Blocked</option></select></label><label className="span-2">Default disclaimer<textarea value={draft.defaultDisclaimer} onChange={(event) => set("defaultDisclaimer", event.target.value)} /></label></div><div className="defaults-actions"><button className="ghost-button" onClick={() => setDraft(workspace.contentDefaults)}><RefreshCcw />Reset</button><button className="primary-button" onClick={() => { onWorkspaceChange({ ...workspace, contentDefaults: draft, coverStyle: draft.defaultReportStyle, disclaimer: draft.defaultDisclaimer }); notify("Workspace content defaults saved and applied to generators"); }}><Save />Save defaults</button></div></section><aside className="defaults-preview-card"><h3>Generation preview</h3><div><span>Sales Copilot</span><strong>{draft.defaultTone} · {draft.defaultLanguage}</strong><p>{draft.defaultMessageLength} output with {draft.brokerCanOverride ? "broker override allowed" : "workspace-enforced style"}.</p></div><div><span>Report Studio</span><strong>{reportTemplates.find((item) => item.id === draft.defaultReportTemplate)?.name}</strong><p>{draft.defaultReportStyle} cover style · disclaimer included by default.</p></div><div><span>Agency policy</span><strong>{draft.agencyLocksDefaults ? "Locked defaults" : "Flexible defaults"}</strong><p>{draft.agencyLocksDefaults ? "Agents cannot override approved tone/language defaults." : "Agents can adapt tone/language per buyer."}</p></div><div className="defaults-flow"><Check />Defaults feed into report and message generation in this frontend prototype.</div></aside></div>;
}
