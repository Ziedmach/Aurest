"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, Eye, EyeOff, Home, KeyRound, LockKeyhole, Mail, ShieldCheck, Sparkles, User, Users } from "lucide-react";
import type { AuthSession, SignupPayload } from "@/lib/auth";
import { createDemoSession } from "@/lib/auth";
import type { WorkspaceType } from "@/lib/workspace";
import { workspaceTypeMeta } from "@/lib/workspace";

type Props = {
  onLogin: (session: AuthSession) => void;
  onSignup: (session: AuthSession, payload: SignupPayload) => void;
};

type Mode = "login" | "signup" | "forgot" | "reset-sent";

export function AuthScreen({ onLogin, onSignup }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("zied@example.com");
  const [password, setPassword] = useState("Demo12345!");
  const [workspaceName, setWorkspaceName] = useState("Zied Properties");
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>("solo");
  const [remember, setRemember] = useState(true);

  function login(event: React.FormEvent) {
    event.preventDefault();
    onLogin(createDemoSession({ name: "Zied Machkena", email, workspaceId: "ws_zied_properties" }));
  }

  function signup(event: React.FormEvent) {
    event.preventDefault();
    const payload = { name, email, workspaceName, workspaceType };
    onSignup(createDemoSession({ name, email, workspaceId: `ws_${Date.now()}` }), payload);
  }

  return <main className="auth-page">
    <section className="auth-brand-panel">
      <div className="auth-brand"><i><Home /></i><strong>Dubai Property<span>Intel</span></strong></div>
      <div className="auth-story"><span><Sparkles />AI SALES COPILOT</span><h1>Turn buyer needs into credible property recommendations.</h1><p>One secure workspace for buyer intelligence, property matching, branded reports, and broker-ready sales content.</p><div className="auth-proof"><div><Check /><span><strong>Workspace isolated</strong>Your data never appears in another brokerage.</span></div><div><Check /><span><strong>Role controlled</strong>Every user sees only their permitted records.</span></div><div><Check /><span><strong>Client ready</strong>Personal and agency branding built into reports.</span></div></div></div>
      <small>Dubai Property Intel · Secure broker workspace</small>
    </section>
    <section className="auth-form-side">
      <div className="auth-card">
        {mode === "login" && <><div className="auth-card-heading"><span>WELCOME BACK</span><h2>Sign in to your workspace</h2><p>Use the demo credentials or enter any valid email and password.</p></div><form onSubmit={login}><label>Email address<div><Mail /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div></label><label>Password<div><LockKeyhole /><input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label><div className="auth-form-options"><label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />Remember this device</label><button type="button" onClick={() => setMode("forgot")}>Forgot password?</button></div><button className="auth-primary" type="submit">Sign in securely <ArrowRight /></button></form><div className="auth-divider"><span>New to Dubai Property Intel?</span></div><button className="auth-secondary" onClick={() => setMode("signup")}>Create broker workspace</button><div className="auth-security-note"><ShieldCheck /><span><strong>Secure demo session</strong>Production uses HTTP-only cookies, rotation, expiry, and workspace-scoped authorization.</span></div></>}
        {mode === "signup" && <><button className="auth-back" onClick={() => setMode("login")}><ArrowLeft />Back to sign in</button><div className="auth-card-heading"><span>CREATE ACCOUNT</span><h2>Start your broker workspace</h2><p>Your first user becomes the workspace owner.</p></div><form onSubmit={signup}><div className="auth-two-cols"><label>Full name<div><User /><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" /></div></label><label>Work email<div><Mail /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div></label></div><label>Workspace name<div><Building2 /><input required value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} /></div></label><div className="signup-type-label">Workspace type</div><div className="signup-type-grid">{(["solo", "team", "agency"] as WorkspaceType[]).map((type) => <button type="button" key={type} className={workspaceType === type ? "selected" : ""} onClick={() => setWorkspaceType(type)}>{type === "solo" ? <User /> : type === "team" ? <Users /> : <Building2 />}<strong>{workspaceTypeMeta[type].label}</strong><small>{workspaceTypeMeta[type].users}</small>{workspaceType === type && <Check />}</button>)}</div><label>Password<div><LockKeyhole /><input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label><div className="password-rules"><span className={password.length >= 8 ? "valid" : ""}><Check />8+ characters</span><span className={/[A-Z]/.test(password) ? "valid" : ""}><Check />Uppercase</span><span className={/\d/.test(password) ? "valid" : ""}><Check />Number</span></div><label className="terms"><input required type="checkbox" defaultChecked />I agree to the workspace privacy and acceptable-use terms.</label><button className="auth-primary" type="submit">Create secure workspace <ArrowRight /></button></form></>}
        {mode === "forgot" && <><button className="auth-back" onClick={() => setMode("login")}><ArrowLeft />Back to sign in</button><div className="reset-icon"><KeyRound /></div><div className="auth-card-heading centered"><span>ACCOUNT RECOVERY</span><h2>Reset your password</h2><p>Enter your account email. We’ll simulate a secure, expiring reset link.</p></div><form onSubmit={(event) => { event.preventDefault(); setMode("reset-sent"); }}><label>Email address<div><Mail /><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div></label><button className="auth-primary" type="submit">Send reset link</button></form></>}
        {mode === "reset-sent" && <div className="reset-success"><i><Check /></i><span>RESET LINK CREATED</span><h2>Check your email</h2><p>A one-time password reset link was generated for <strong>{email}</strong>. In production it expires after 30 minutes and invalidates previous links.</p><button className="auth-primary" onClick={() => setMode("login")}>Return to sign in</button></div>}
      </div>
    </section>
  </main>;
}
