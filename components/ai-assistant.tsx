"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ClipboardCheck,
  FileText,
  Mic,
  PanelRightOpen,
  Send,
  Sparkles,
  Target,
  UserPlus,
  WandSparkles,
  X,
} from "lucide-react";
import type { BrokerProfile, Workspace } from "@/lib/workspace";
import {
  actionConfirmationMessage,
  aiQuickPrompts,
  aiVoiceTranscripts,
  buildInitialAiMessages,
  confirmAiAction,
  runAiCommand,
  type AiActionCard,
  type AiActionHistoryItem,
  type AiCommandContext,
  type AiConversationMessage,
} from "@/lib/ai-command";
import { initialBuyerProfiles } from "@/lib/buyer-data";
import { initialProperties } from "@/lib/property-data";

type AssistantProps = {
  workspace: Workspace;
  profile: BrokerProfile;
  activeModule: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (module: string) => void;
  notify: (message: string) => void;
  history: AiActionHistoryItem[];
  onHistoryChange: (history: AiActionHistoryItem[]) => void;
};

type CenterProps = Omit<AssistantProps, "open" | "onOpenChange">;

export function AiAssistantDrawer(props: AssistantProps) {
  const [messages, setMessages] = useState<AiConversationMessage[]>(() => buildInitialAiMessages(props.profile.fullName));
  return <>
    <button className="ai-floating-button" onClick={() => props.onOpenChange(true)}><Sparkles size={18} />Ask Aurest</button>
    {props.open && <div className="ai-drawer-shell">
      <button className="ai-drawer-backdrop" onClick={() => props.onOpenChange(false)} aria-label="Close AI assistant" />
      <aside className="ai-drawer">
        <header><div><span><Bot size={14} />Aurest AI</span><h2>Native broker discussion</h2><p>Talk naturally. I’ll preview actions before anything changes.</p></div><button onClick={() => props.onOpenChange(false)} aria-label="Close AI assistant"><X size={17} /></button></header>
        <AiConversation {...props} messages={messages} setMessages={setMessages} compact />
      </aside>
    </div>}
  </>;
}

export function AiCommandCenter(props: CenterProps) {
  const [messages, setMessages] = useState<AiConversationMessage[]>(() => buildInitialAiMessages(props.profile.fullName));
  const kpis = useMemo(() => [
    ["AI actions confirmed", String(props.history.length), "local in-session history"],
    ["Supported intents", "11", "buyers, reports, market, pitches"],
    ["Context", props.activeModule, "current module"],
    ["Safety mode", "Confirm-first", "no auto mutation"],
  ], [props.history.length, props.activeModule]);

  return <div className="ai-command-center">
    <section className="ai-center-hero">
      <div>
        <span><Sparkles size={15} />AI COMMAND CENTER</span>
        <h2>Speak with Aurest and turn broker instructions into confirmable actions.</h2>
        <p>Frontend demo mode: no real AI API, no speech recognition, no backend persistence. The assistant uses local deterministic command handling and existing Aurest workflows.</p>
      </div>
      <aside><strong>{props.history.length}</strong><span>confirmed actions</span><small>resets on refresh</small></aside>
    </section>

    <section className="ai-center-kpis">{kpis.map(([label, value, detail]) => <article key={label}><span>{label}</span><strong>{value}</strong><p>{detail}</p></article>)}</section>

    <div className="ai-center-layout">
      <section className="ai-center-chat"><AiConversation {...props} messages={messages} setMessages={setMessages} /></section>
      <aside className="ai-context-rail">
        <ContextCard workspace={props.workspace} profile={props.profile} activeModule={props.activeModule} />
        <CommandLibrary onPrompt={(prompt) => setMessages((all) => [...all, userMessage(prompt), assistantFromResult(runAiCommand(prompt, commandContext(props)))])} />
        <HistoryPanel history={props.history} onNavigate={props.onNavigate} />
      </aside>
    </div>
  </div>;
}

function AiConversation({ workspace, activeModule, onNavigate, notify, history, onHistoryChange, messages, setMessages, compact = false }: CenterProps & { messages: AiConversationMessage[]; setMessages: Dispatch<SetStateAction<AiConversationMessage[]>>; compact?: boolean }) {
  const [input, setInput] = useState("");
  const [voiceIndex, setVoiceIndex] = useState(0);
  const ctx = commandContext({ workspace, activeModule });

  function send(value = input) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const result = runAiCommand(trimmed, ctx);
    setMessages((all) => [...all, userMessage(trimmed), assistantFromResult(result)]);
    setInput("");
  }

  function fakeVoice() {
    const transcript = aiVoiceTranscripts[voiceIndex % aiVoiceTranscripts.length];
    setVoiceIndex((index) => index + 1);
    setInput(transcript);
    notify("Fake voice transcript inserted");
  }

  function confirm(action: AiActionCard) {
    const item = confirmAiAction(action);
    onHistoryChange([item, ...history]);
    if (action.type === "open_module") onNavigate(String(action.payload.targetModule || action.targetModule));
    if (["show_matches", "create_shortlist", "copy_pitch", "create_report", "schedule_viewing", "create_follow_up", "include_market_summary"].includes(action.type)) {
      if (action.type === "copy_pitch") navigator.clipboard?.writeText(action.description);
      if (action.type === "create_report") onNavigate("Reports");
      if (action.type === "show_matches" || action.type === "create_shortlist") onNavigate(action.targetModule);
      if (action.type === "include_market_summary") onNavigate("Market Benchmarks");
      if (action.type === "schedule_viewing" || action.type === "create_follow_up") onNavigate("Deal Pipeline");
    }
    notify(actionConfirmationMessage(action));
    setMessages((all) => all.map((message) => message.actions?.some((candidate) => candidate.id === action.id) ? { ...message, actions: message.actions?.map((candidate) => candidate.id === action.id ? { ...candidate, status: "confirmed" } : candidate) } : message));
  }

  return <div className={compact ? "ai-conversation compact" : "ai-conversation"}>
    <div className="ai-message-list">
      {messages.map((message) => <article key={message.id} className={`ai-message ${message.role}`}>
        <i>{message.role === "assistant" ? <Bot size={14} /> : <Sparkles size={14} />}</i>
        <div>
          <p>{message.body}</p>
          {message.intent && <div className="ai-detection-row"><span>{message.intent.replaceAll("_", " ")}</span><em>{message.confidence} confidence</em>{message.requiredContext?.length ? <b>Needs: {message.requiredContext.join(", ")}</b> : <b>Context OK</b>}</div>}
          {message.actions?.length ? <div className="ai-action-list">{message.actions.map((action) => <ActionCard key={action.id} action={action} onConfirm={() => confirm(action)} onOpen={() => onNavigate(action.targetModule)} notify={notify} />)}</div> : null}
          {message.suggestions?.length ? <div className="ai-suggestions">{message.suggestions.map((suggestion) => <button key={suggestion} onClick={() => send(suggestion)}>{suggestion}</button>)}</div> : null}
          <small>{message.createdAt}</small>
        </div>
      </article>)}
    </div>

    <div className="ai-quick-prompts">{aiQuickPrompts.slice(0, compact ? 4 : 7).map((prompt) => <button key={prompt} onClick={() => send(prompt)}>{prompt}</button>)}</div>

    <form className="ai-input-row" onSubmit={(event) => { event.preventDefault(); send(); }}>
      <button type="button" onClick={fakeVoice} title="Insert fake voice transcript"><Mic size={16} /></button>
      <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask Aurest to create, find, generate, open, explain…" />
      <button type="submit"><Send size={16} /></button>
    </form>
  </div>;
}

function ActionCard({ action, onConfirm, onOpen, notify }: { action: AiActionCard; onConfirm: () => void; onOpen: () => void; notify: (message: string) => void }) {
  return <article className={`ai-action-card ${action.status}`}>
    <div><span>{action.type.replaceAll("_", " ")}</span><em>{action.status}</em></div>
    <h3>{action.title}</h3>
    <p>{action.description}</p>
    <footer>
      <button disabled={action.status === "confirmed"} onClick={onConfirm}><Check size={13} />Confirm</button>
      <button onClick={() => notify("Edit context placeholder opened")}>Edit context</button>
      <button onClick={onOpen}><PanelRightOpen size={13} />Open module</button>
    </footer>
  </article>;
}

function ContextCard({ workspace, profile, activeModule }: { workspace: Workspace; profile: BrokerProfile; activeModule: string }) {
  return <section className="ai-context-card">
    <span><ClipboardCheck size={14} />Current context</span>
    <Info label="Workspace" value={`${workspace.name} · ${workspace.type}`} />
    <Info label="Broker" value={profile.fullName} />
    <Info label="Active module" value={activeModule} />
    <Info label="Selected buyer" value={initialBuyerProfiles[0].name} />
    <Info label="Selected property" value={initialProperties[0].title} />
  </section>;
}

function CommandLibrary({ onPrompt }: { onPrompt: (prompt: string) => void }) {
  const commands = [
    ["Create buyer", "Capture a buyer profile preview", UserPlus],
    ["Find matches", "Rank properties for a buyer", Target],
    ["Generate pitch", "Draft WhatsApp copy", WandSparkles],
    ["Create report", "Open report generation", FileText],
  ] as const;
  return <section className="ai-command-library">
    <h3>Supported command library</h3>
    {commands.map(([title, detail, Icon]) => <button key={title} onClick={() => onPrompt(title)}><Icon size={15} /><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight size={13} /></button>)}
  </section>;
}

function HistoryPanel({ history, onNavigate }: { history: AiActionHistoryItem[]; onNavigate: (module: string) => void }) {
  return <section className="ai-history-panel">
    <h3>Recent AI actions</h3>
    {history.length === 0 ? <p>No confirmed AI actions yet. Confirm an action card to add it here.</p> : history.slice(0, 7).map((item) => <button key={item.id} onClick={() => onNavigate(item.targetModule)}><Check size={13} /><span><strong>{item.title}</strong><small>{item.confirmedAt} · {item.targetModule}</small></span></button>)}
  </section>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="ai-info-line"><span>{label}</span><strong>{value}</strong></div>;
}

function commandContext(props: { workspace: Workspace; activeModule: string }): AiCommandContext {
  return { workspace: props.workspace, activeModule: props.activeModule, selectedBuyerId: "buy_omar", selectedPropertyId: "prop_bayut_983410" };
}

function userMessage(body: string): AiConversationMessage {
  return { id: `msg_user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, role: "user", body, createdAt: "Just now" };
}

function assistantFromResult(result: ReturnType<typeof runAiCommand>): AiConversationMessage {
  return {
    id: `msg_ai_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    role: "assistant",
    body: result.assistantMessage,
    createdAt: "Just now",
    intent: result.intent,
    confidence: result.confidence,
    requiredContext: result.requiredContext,
    actions: result.actions,
    suggestions: result.suggestions,
  };
}
