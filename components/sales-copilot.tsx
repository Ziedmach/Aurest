"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, FileText, History, Languages, Mail, MessageCircle, PhoneCall, RefreshCcw, Send, Sparkles, Trash2, UserRound } from "lucide-react";
import { initialBuyerProfiles } from "@/lib/buyer-data";
import { initialProperties } from "@/lib/property-data";
import { generateCallScript, generateEmail, generateFollowUps, generateObjectionResponse, generateWhatsAppMessage, objections, salesLanguages, salesTones, whatsAppMessageTypes, type FollowUpMessage, type ObjectionType, type SalesContentHistoryItem, type SalesContentType, type SalesLanguage, type SalesTone, type WhatsAppMessageType } from "@/lib/sales-content";
import type { BrokerProfile, Workspace } from "@/lib/workspace";

type Tab = "WhatsApp" | "Email" | "Call script" | "Follow-ups" | "Objections";
type GeneratorProps = {
  buyer: typeof initialBuyerProfiles[number];
  properties: typeof initialProperties;
  primaryProperty: typeof initialProperties[number];
  tone: SalesTone;
  language: SalesLanguage;
  notify: (message: string) => void;
  saveHistory: (contentType: SalesContentType, title: string, body: string, done?: boolean) => void;
  copyAndLog: (contentType: SalesContentType, title: string, body: string) => void;
};

export function SalesCopilot({ workspace, profile, notify }: { workspace: Workspace; profile: BrokerProfile; notify: (message: string) => void }) {
  const [tab, setTab] = useState<Tab>("WhatsApp");
  const [buyerId, setBuyerId] = useState(initialBuyerProfiles[0].id);
  const [propertyIds, setPropertyIds] = useState<string[]>([initialProperties[0].id]);
  const [tone, setTone] = useState<SalesTone>(workspace.contentDefaults.defaultTone);
  const [language, setLanguage] = useState<SalesLanguage>(workspace.contentDefaults.defaultLanguage);
  const [history, setHistory] = useState<SalesContentHistoryItem[]>([]);
  const buyer = initialBuyerProfiles.find((item) => item.id === buyerId) ?? initialBuyerProfiles[0];
  const properties = initialProperties.filter((item) => propertyIds.includes(item.id));
  const primaryProperty = properties[0] ?? initialProperties[0];

  function toggleProperty(id: string) {
    setPropertyIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 5 ? current : [...current, id]);
  }

  function saveHistory(contentType: SalesContentType, title: string, body: string, done = false) {
    setHistory((items) => [{ id: `sales_${Date.now()}`, buyerId: buyer.id, propertyIds, contentType, tone, language, title, body, createdAt: "Just now", done }, ...items]);
    notify(`${contentType} saved to buyer activity`);
  }

  function copyAndLog(contentType: SalesContentType, title: string, body: string) {
    navigator.clipboard?.writeText(body);
    setHistory((items) => [{ id: `sales_${Date.now()}`, buyerId: buyer.id, propertyIds, contentType, tone, language, title, body, createdAt: "Just now", copiedAt: "Just now" }, ...items]);
    notify(`${contentType} copied and logged`);
  }

  function deleteHistory(id: string) {
    setHistory((items) => items.filter((item) => item.id !== id));
    notify("Saved sales content deleted");
  }

  return <div className="module-stack sales-copilot">
    <section className="sales-hero">
      <div><span><Sparkles />SALES CONTENT COPILOT</span><h2>Client-ready sales content from buyer, report and property context</h2><p>Generate WhatsApp, email, call scripts, follow-ups and objection handling with local fake buyer timeline/history.</p></div>
      <div><strong>{workspace.name}</strong><small>Workspace defaults: {workspace.contentDefaults.defaultTone} · {workspace.contentDefaults.defaultLanguage} · {workspace.contentDefaults.defaultMessageLength}</small><em>{profile.fullName}</em></div>
    </section>

    <section className="sales-context-card enhanced">
      <label><UserRound />Buyer<select value={buyerId} onChange={(event) => setBuyerId(event.target.value)}>{initialBuyerProfiles.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.persona}</option>)}</select></label>
      <label><Sparkles />Tone<select value={tone} disabled={!workspace.contentDefaults.brokerCanOverride} onChange={(event) => setTone(event.target.value as SalesTone)}>{salesTones.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><Languages />Language<select value={language} disabled={!workspace.contentDefaults.brokerCanOverride} onChange={(event) => setLanguage(event.target.value as SalesLanguage)}>{salesLanguages.map((item) => <option key={item}>{item}</option>)}</select></label>
      <button onClick={() => notify(`Regenerated using ${tone} · ${language}`)}><RefreshCcw />Regenerate with style</button>
    </section>

    <section className="sales-property-picker">
      <div><strong>Selected properties</strong><span>{propertyIds.length}/5 selected · first selected property drives single-property generators</span></div>
      <div>{initialProperties.map((property) => <button key={property.id} className={propertyIds.includes(property.id) ? "selected" : ""} onClick={() => toggleProperty(property.id)}><FileText />{property.title}<small>{property.neighbourhood}</small>{propertyIds.includes(property.id) && <Check />}</button>)}</div>
    </section>

    <div className="sales-tabs">{(["WhatsApp", "Email", "Call script", "Follow-ups", "Objections"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item === "WhatsApp" ? <MessageCircle /> : item === "Email" ? <Mail /> : item === "Call script" ? <PhoneCall /> : item === "Follow-ups" ? <Send /> : <Sparkles />}{item}</button>)}</div>

    {tab === "WhatsApp" && <WhatsAppGenerator buyer={buyer} properties={properties} primaryProperty={primaryProperty} tone={tone} language={language} notify={notify} saveHistory={saveHistory} copyAndLog={copyAndLog} />}
    {tab === "Email" && <EmailGenerator buyer={buyer} properties={properties} primaryProperty={primaryProperty} tone={tone} language={language} notify={notify} saveHistory={saveHistory} copyAndLog={copyAndLog} />}
    {tab === "Call script" && <CallScriptGenerator buyer={buyer} properties={properties} primaryProperty={primaryProperty} tone={tone} language={language} notify={notify} saveHistory={saveHistory} copyAndLog={copyAndLog} />}
    {tab === "Follow-ups" && <FollowUpGenerator buyer={buyer} properties={properties} primaryProperty={primaryProperty} tone={tone} language={language} notify={notify} saveHistory={saveHistory} copyAndLog={copyAndLog} />}
    {tab === "Objections" && <ObjectionAssistant buyer={buyer} properties={properties} primaryProperty={primaryProperty} tone={tone} language={language} notify={notify} saveHistory={saveHistory} copyAndLog={copyAndLog} />}

    <SalesHistoryPanel items={history.filter((item) => item.buyerId === buyer.id)} onCopy={(item) => copyAndLog(item.contentType, `Reused ${item.title}`, item.body)} onDone={(item) => setHistory((items) => items.map((entry) => entry.id === item.id ? { ...entry, done: !entry.done } : entry))} onDelete={deleteHistory} />
  </div>;
}

function WhatsAppGenerator({ buyer, primaryProperty, tone, language, copyAndLog, saveHistory }: GeneratorProps) {
  const [type, setType] = useState<WhatsAppMessageType>("First recommendation");
  const [objection, setObjection] = useState<ObjectionType>("Price is too high");
  const [version, setVersion] = useState(1);
  const text = useMemo(() => `${generateWhatsAppMessage(type, buyer, primaryProperty, tone, language, objection)}${version > 1 ? `\n\nVariation ${version}: regenerated with ${tone} tone.` : ""}`, [buyer, primaryProperty, tone, language, type, objection, version]);
  return <section className="sales-generator-grid">
    <aside className="sales-brief-card"><GeneratorBrief buyer={buyer} property={primaryProperty} /><label>Message type<select value={type} onChange={(event) => setType(event.target.value as WhatsAppMessageType)}>{whatsAppMessageTypes.map((item) => <option key={item}>{item}</option>)}</select></label>{type === "Objection response" && <label>Objection<select value={objection} onChange={(event) => setObjection(event.target.value as ObjectionType)}>{objections.map((item) => <option key={item}>{item}</option>)}</select></label>}<button onClick={() => setVersion((value) => value + 1)}><RefreshCcw />Regenerate</button><button onClick={() => saveHistory("WhatsApp", type, text)}><History />Save to history</button></aside>
    <ContentEditor title="WhatsApp message" subtitle="Short, natural, buyer-specific" value={text} copyLabel="Copy WhatsApp" onCopy={(body) => copyAndLog("WhatsApp", type, body)} />
  </section>;
}

function EmailGenerator({ buyer, primaryProperty, tone, language, copyAndLog, saveHistory }: GeneratorProps) {
  const generated = useMemo(() => generateEmail(buyer, primaryProperty, tone, language), [buyer, primaryProperty, tone, language]);
  const [subject, setSubject] = useState(generated.subject);
  const [body, setBody] = useState(generated.body);
  useEffect(() => { setSubject(generated.subject); setBody(generated.body); }, [generated]);
  function refresh() { const next = generateEmail(buyer, primaryProperty, tone, language); setSubject(next.subject); setBody(next.body); }
  return <section className="sales-generator-grid">
    <aside className="sales-brief-card"><GeneratorBrief buyer={buyer} property={primaryProperty} /><button onClick={refresh}><RefreshCcw />Regenerate email</button><button onClick={() => saveHistory("Email", subject, `${subject}\n\n${body}`)}><History />Save to history</button><div className="sales-checklist"><span><Check />Subject line</span><span><Check />Property summary</span><span><Check />Buyer reasoning</span><span><Check />Report reference</span></div></aside>
    <section className="sales-output-card"><header><div><h3>Email draft</h3><p>Editable client email with attachment/report reference</p></div><button onClick={() => copyAndLog("Email", subject, `${subject}\n\n${body}`)}><Copy />Copy email</button></header><label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} /></label><textarea value={body} onChange={(event) => setBody(event.target.value)} /></section>
  </section>;
}

function CallScriptGenerator({ buyer, primaryProperty, tone, language, copyAndLog, saveHistory }: GeneratorProps) {
  const [version, setVersion] = useState(1);
  const sections = useMemo(() => generateCallScript(buyer, primaryProperty, tone, language).map((item) => version > 1 ? { ...item, content: `${item.content} (${tone} variation ${version})` } : item), [buyer, primaryProperty, tone, language, version]);
  const script = sections.map((item) => `${item.title}\n${item.content}`).join("\n\n");
  return <section className="sales-script-layout"><GeneratorBrief buyer={buyer} property={primaryProperty} /><div className="call-script-stack">{sections.map((section) => <article key={section.title}><span>{section.title}</span><p>{section.content}</p></article>)}<div className="sales-actions"><button onClick={() => setVersion((value) => value + 1)}><RefreshCcw />Regenerate</button><button onClick={() => copyAndLog("Call script", "Call script", script)}><Copy />Copy script</button><button onClick={() => saveHistory("Call script", "Call script", script)}><Check />Save script</button></div></div></section>;
}

function FollowUpGenerator({ buyer, primaryProperty, tone, language, copyAndLog, saveHistory }: GeneratorProps) {
  const [messages, setMessages] = useState<FollowUpMessage[]>(() => generateFollowUps(buyer, primaryProperty, tone, language));
  useEffect(() => setMessages(generateFollowUps(buyer, primaryProperty, tone, language)), [buyer, primaryProperty, tone, language]);
  function toggleDone(item: FollowUpMessage) {
    setMessages((all) => all.map((message) => message.id === item.id ? { ...message, done: !message.done } : message));
    saveHistory("Follow-up", item.type, item.text, true);
  }
  return <section className="followup-grid">{messages.map((item) => <article key={item.id} className={item.done ? "done" : ""}><header><span>{item.type}</span><button onClick={() => toggleDone(item)}>{item.done ? <Check /> : <span />}{item.done ? "Done" : "Mark done"}</button></header><p>{item.text}</p><footer><button onClick={() => copyAndLog("Follow-up", item.type, item.text)}><Copy />Copy</button><button onClick={() => saveHistory("Follow-up", item.type, item.text, item.done)}><History />Save</button></footer></article>)}</section>;
}

function ObjectionAssistant({ buyer, primaryProperty, tone, language, copyAndLog, saveHistory }: GeneratorProps) {
  const [objection, setObjection] = useState<ObjectionType>("Price is too high");
  const response = useMemo(() => generateObjectionResponse(objection, buyer, primaryProperty, tone, language), [objection, buyer, primaryProperty, tone, language]);
  return <section className="objection-layout">
    <aside className="objection-list">{objections.map((item) => <button key={item} className={objection === item ? "active" : ""} onClick={() => setObjection(item)}>{item}</button>)}</aside>
    <div className="objection-output"><ContentEditor title="WhatsApp response" subtitle={response.guardrail} value={response.whatsapp} copyLabel="Copy WhatsApp" onCopy={(body) => copyAndLog("Objection", objection, body)} /><ContentEditor title="Call talking point" subtitle="Acknowledge, explain, close" value={response.callTalkingPoint} copyLabel="Copy call point" onCopy={(body) => copyAndLog("Objection", `${objection} · call`, body)} /><button className="primary-button" onClick={() => saveHistory("Objection", objection, `${response.whatsapp}\n\n${response.callTalkingPoint}`)}><History />Save objection response</button></div>
  </section>;
}

function GeneratorBrief({ buyer, property }: { buyer: typeof initialBuyerProfiles[number]; property: typeof initialProperties[number] }) {
  return <div className="generator-brief"><span>CONTEXT USED</span><strong>{buyer.name}</strong><p>{buyer.persona} · {buyer.preferredAreas.join(", ")} · AED {buyer.budgetMin.toLocaleString()}–{buyer.budgetMax.toLocaleString()}</p><strong>{property.title}</strong><p>{property.neighbourhood} · AED {property.price.toLocaleString()} · {property.rooms || "Studio"} bed · {property.estimatedYield ? `${property.estimatedYield}% yield` : property.completionStatus}</p></div>;
}

function ContentEditor({ title, subtitle, value, copyLabel, onCopy }: { title: string; subtitle: string; value: string; copyLabel: string; onCopy: (value: string) => void }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return <section className="sales-output-card"><header><div><h3>{title}</h3><p>{subtitle}</p></div><button onClick={() => onCopy(draft)}><Copy />{copyLabel}</button></header><textarea value={draft} onChange={(event) => setDraft(event.target.value)} /></section>;
}

function SalesHistoryPanel({ items, onCopy, onDone, onDelete }: { items: SalesContentHistoryItem[]; onCopy: (item: SalesContentHistoryItem) => void; onDone: (item: SalesContentHistoryItem) => void; onDelete: (id: string) => void }) {
  return <section className="sales-history-panel"><header><div><h3>Sales content history</h3><p>Local buyer timeline for generated, copied and saved content.</p></div><span>{items.length} item{items.length === 1 ? "" : "s"}</span></header>{items.length ? <div>{items.map((item) => <article key={item.id} className={item.done ? "done" : ""}><i>{item.contentType === "WhatsApp" ? <MessageCircle /> : item.contentType === "Email" ? <Mail /> : item.contentType === "Call script" ? <PhoneCall /> : <History />}</i><span><strong>{item.title}</strong><small>{item.contentType} · {item.tone} · {item.language} · {item.createdAt}{item.copiedAt ? ` · copied ${item.copiedAt}` : ""}</small><p>{item.body.slice(0, 180)}{item.body.length > 180 ? "…" : ""}</p></span><footer><button onClick={() => onCopy(item)}><Copy />Reuse</button><button onClick={() => onDone(item)}><Check />{item.done ? "Done" : "Mark done"}</button><button onClick={() => onDelete(item.id)}><Trash2 />Delete</button></footer></article>)}</div> : <div className="sales-history-empty"><History /><p>No generated content saved for this buyer yet.</p></div>}</section>;
}
