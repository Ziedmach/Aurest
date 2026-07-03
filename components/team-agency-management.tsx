"use client";

import { useMemo, useState } from "react";
import { BarChart3, Building2, Check, ClipboardList, Download, Eye, FileText, Lock, Mail, Palette, Pencil, Search, Settings, ShieldCheck, Trash2, Upload, UserCheck, UserPlus, Users } from "lucide-react";
import { demoBuyers } from "@/lib/demo-data";
import { initialProperties } from "@/lib/property-data";
import { initialReports, type StudioReport } from "@/lib/report-data";
import { ConfirmModal, FormActions, UiModal } from "@/components/ui-modal";
import type { Workspace } from "@/lib/workspace";

type MemberRole = "Owner" | "Admin" | "Manager" | "Broker / Agent" | "Viewer";
type TeamMemberRecord = { id: string; name: string; email: string; initials: string; role: MemberRole; status: "Active" | "Invited"; buyers: number; reports: number; messages: number; followUps: number; lastActive: string; canImport: boolean };
type Assignment = { buyerId: string; ownerId: string; status: string; lastUpdated: string };
type Tab = "Team" | "Shared database" | "Assignments" | "Report visibility" | "Manager dashboard" | "Agency admin";

const membersSeed: TeamMemberRecord[] = [
  { id: "mem_zied", name: "Zied Machkena", email: "zied@example.com", initials: "ZM", role: "Owner", status: "Active", buyers: 12, reports: 18, messages: 44, followUps: 21, lastActive: "Online", canImport: true },
  { id: "mem_maya", name: "Maya Rahman", email: "maya@example.com", initials: "MR", role: "Manager", status: "Active", buyers: 9, reports: 14, messages: 31, followUps: 18, lastActive: "12 min ago", canImport: true },
  { id: "mem_rami", name: "Rami Haddad", email: "rami@example.com", initials: "RH", role: "Broker / Agent", status: "Active", buyers: 7, reports: 11, messages: 26, followUps: 15, lastActive: "1 hr ago", canImport: false },
  { id: "mem_noor", name: "Noor Khan", email: "noor@example.com", initials: "NK", role: "Viewer", status: "Invited", buyers: 0, reports: 0, messages: 0, followUps: 0, lastActive: "Invitation sent", canImport: false },
];

const assignmentSeed: Assignment[] = [
  { buyerId: "buy_omar", ownerId: "mem_zied", status: "Qualified", lastUpdated: "Today" },
  { buyerId: "buy_sarah", ownerId: "mem_zied", status: "Viewing scheduled", lastUpdated: "Today" },
  { buyerId: "buy_james", ownerId: "mem_maya", status: "Shortlist sent", lastUpdated: "Yesterday" },
  { buyerId: "buy_lina", ownerId: "mem_rami", status: "New lead", lastUpdated: "22 Jun" },
];

export function TeamAgencyManagement({ workspace, notify }: { workspace: Workspace; notify: (message: string) => void }) {
  const [tab, setTab] = useState<Tab>("Team");
  const [members, setMembers] = useState(membersSeed);
  const [assignments, setAssignments] = useState(assignmentSeed);
  const [invite, setInvite] = useState<TeamMemberRecord | "new" | null>(null);
  const [remove, setRemove] = useState<TeamMemberRecord | null>(null);
  const metrics = useMemo(() => summarizeTeam(members), [members]);

  function saveMember(member: TeamMemberRecord) {
    setMembers((all) => all.some((item) => item.id === member.id) ? all.map((item) => item.id === member.id ? member : item) : [member, ...all]);
    setInvite(null);
    notify(member.status === "Invited" ? "Invitation email prepared and role assigned" : "Team member updated");
  }

  return <div className="module-stack team-agency-epic">
    <section className="team-agency-hero"><div><span><Users />TEAM & AGENCY MANAGEMENT</span><h2>Members, shared data, assignments and admin controls</h2><p>{workspace.name} can invite users, share property data, assign buyers, monitor activity and lock agency-level settings.</p></div><button className="primary-button" onClick={() => setInvite("new")}><UserPlus />Invite member</button></section>
    <div className="team-agency-kpis"><Kpi label="Active brokers" value={String(metrics.activeBrokers)} detail="Role-filtered" /><Kpi label="Buyer profiles" value={String(metrics.buyers)} detail="Created / assigned" /><Kpi label="Reports generated" value={String(metrics.reports)} detail="This month" /><Kpi label="WhatsApp messages" value={String(metrics.messages)} detail="Generated" /><Kpi label="Follow-ups" value={String(metrics.followUps)} detail="Generated" /></div>
    <div className="team-agency-tabs">{(["Team", "Shared database", "Assignments", "Report visibility", "Manager dashboard", "Agency admin"] as Tab[]).map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{iconForTab(item)}{item}</button>)}</div>

    {tab === "Team" && <InviteTeamView members={members} onEdit={setInvite} onRemove={setRemove} />}
    {tab === "Shared database" && <SharedDatabaseView members={members} setMembers={setMembers} notify={notify} />}
    {tab === "Assignments" && <AssignmentView members={members} assignments={assignments} setAssignments={setAssignments} notify={notify} />}
    {tab === "Report visibility" && <ReportVisibilityView members={members} notify={notify} />}
    {tab === "Manager dashboard" && <ManagerDashboard members={members} assignments={assignments} />}
    {tab === "Agency admin" && <AgencyAdminDashboard notify={notify} />}

    {invite && <InviteMemberModal member={invite === "new" ? undefined : invite} onClose={() => setInvite(null)} onSave={saveMember} />}
    {remove && <ConfirmModal title="Remove team member?" message={`${remove.name} will lose workspace access. Assigned buyers can be reassigned before removal in production.`} confirmLabel="Remove access" onCancel={() => setRemove(null)} onConfirm={() => { setMembers((all) => all.filter((item) => item.id !== remove.id)); setRemove(null); notify("Member access removed"); }} />}
  </div>;
}

function InviteTeamView({ members, onEdit, onRemove }: { members: TeamMemberRecord[]; onEdit: (member: TeamMemberRecord) => void; onRemove: (member: TeamMemberRecord) => void }) {
  const [query, setQuery] = useState("");
  const visible = members.filter((item) => `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="team-member-card"><div className="team-member-toolbar"><div><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members…" /></div><span><Mail />Invitee receives email and joins this workspace</span></div><div className="team-member-head"><span>Member</span><span>Role</span><span>Status</span><span>Can import</span><span>Last active</span><span /></div>{visible.map((member) => <div className="team-member-row" key={member.id}><span><i>{member.initials}</i><b>{member.name}<small>{member.email}</small></b></span><em>{member.role}</em><strong className={member.status === "Active" ? "active" : ""}>{member.status}</strong><span>{member.canImport ? <Check /> : "—"}</span><span>{member.lastActive}</span><span><button onClick={() => onEdit(member)}><Pencil /></button>{member.role !== "Owner" && <button title={member.status === "Invited" ? "Cancel pending invite" : "Remove access"} onClick={() => onRemove(member)}><Trash2 /></button>}</span></div>)}</section>;
}

function SharedDatabaseView({ members, setMembers, notify }: { members: TeamMemberRecord[]; setMembers: React.Dispatch<React.SetStateAction<TeamMemberRecord[]>>; notify: (message: string) => void }) {
  const [shared, setShared] = useState(true);
  return <div className="shared-db-layout"><section className="shared-db-card"><div className="section-title"><div><h3>Shared property database</h3><p>Imported listings can be shared across the workspace while personal notes stay private.</p></div><button className={shared ? "active" : ""} onClick={() => setShared(!shared)}>{shared ? "Shared on" : "Shared off"}</button></div><div className="shared-property-grid">{initialProperties.map((property) => <article key={property.id}><div style={property.images[0] ? { backgroundImage: `url(${property.images[0]})` } : undefined} /><strong>{property.title}</strong><span>{property.neighbourhood} · {property.source}</span><p>Shared updates visible to permitted users · private notes broker-scoped</p></article>)}</div></section><aside className="import-permission-card"><Upload /><h3>Import permissions</h3><p>Admin controls who can import listings into the shared workspace database.</p>{members.map((member) => <label key={member.id}><span><strong>{member.name}</strong><small>{member.role}</small></span><button className={member.canImport ? "toggle on" : "toggle"} disabled={member.role === "Owner"} onClick={() => { setMembers((all) => all.map((item) => item.id === member.id ? { ...item, canImport: !item.canImport } : item)); notify("Import permission updated"); }}><i /></button></label>)}</aside></div>;
}

function ReportVisibilityView({ members, notify }: { members: TeamMemberRecord[]; notify: (message: string) => void }) {
  const [broker, setBroker] = useState("All brokers");
  const [area, setArea] = useState("All areas");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<StudioReport | null>(null);
  const visible = initialReports.filter((report) => (broker === "All brokers" || report.createdBy === broker) && (area === "All areas" || report.areas.includes(area)) && `${report.title} ${report.buyerName}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="report-visibility-card"><div className="manager-controls"><label>Broker<select value={broker} onChange={(event) => setBroker(event.target.value)}><option>All brokers</option>{members.filter((member) => member.role !== "Viewer").map((member) => <option key={member.id}>{member.name.split(" ")[0]}</option>)}</select></label><label>Area<select value={area} onChange={(event) => setArea(event.target.value)}><option>All areas</option>{Array.from(new Set(initialReports.flatMap((report) => report.areas))).map((item) => <option key={item}>{item}</option>)}</select></label><div className="report-search-box"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search buyer or report…" /></div><span><ShieldCheck />Broker sees own reports · manager sees assigned team · admin sees workspace</span></div><div className="team-report-head"><span>Report</span><span>Buyer</span><span>Broker</span><span>Area</span><span>Status</span><span>Public link</span><span /></div>{visible.map((report) => <div className="team-report-row" key={report.id}><strong>{report.title}<small>{report.templateName}</small></strong><span>{report.buyerName}</span><span>{report.createdBy}</span><span>{report.areas.join(", ")}</span><em>{report.status}</em><span>{report.publicLink.enabled ? `${report.publicLink.views} views` : "Disabled"}</span><button onClick={() => setPreview(report)}><Eye />Preview</button></div>)}<button className="ghost-button" onClick={() => notify("Filtered report visibility CSV exported")}>Export filtered reports</button>{preview && <UiModal title={preview.title} subtitle={`${preview.buyerName} · ${preview.templateName}`} onClose={() => setPreview(null)}><div className="report-preview-mini"><FileText /><p>Status: {preview.status}. Branding: {preview.brandingMode}. Areas: {preview.areas.join(", ")}. Properties: {preview.propertyTitles.join(", ")}.</p><button className="primary-button" onClick={() => notify("Manager preview opened")}>Open report preview</button></div></UiModal>}</section>;
}

function AssignmentView({ members, assignments, setAssignments, notify }: { members: TeamMemberRecord[]; assignments: Assignment[]; setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>; notify: (message: string) => void }) {
  function assign(buyerId: string, ownerId: string) {
    setAssignments((all) => all.map((item) => item.buyerId === buyerId ? { ...item, ownerId, lastUpdated: "Just now" } : item));
    notify("Buyer reassigned");
  }
  return <section className="assignment-card"><div className="assignment-head"><span>Buyer</span><span>Status</span><span>Assigned broker</span><span>Last updated</span><span>Permission</span></div>{assignments.map((assignment) => { const buyer = demoBuyers.find((item) => item.id === assignment.buyerId); const owner = members.find((item) => item.id === assignment.ownerId); return <div className="assignment-row" key={assignment.buyerId}><span><i>{buyer?.initials}</i><b>{buyer?.name}<small>{buyer?.persona}</small></b></span><em>{assignment.status}</em><select value={assignment.ownerId} onChange={(event) => assign(assignment.buyerId, event.target.value)}>{members.filter((member) => member.role !== "Viewer").map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select><span>{assignment.lastUpdated}</span><strong>{owner?.role === "Manager" ? "Manager + broker" : "Assigned broker"}</strong></div>; })}</section>;
}

function ManagerDashboard({ members, assignments }: { members: TeamMemberRecord[]; assignments: Assignment[] }) {
  const [range, setRange] = useState("Last 30 days");
  const sorted = [...members].sort((a, b) => b.reports + b.messages - (a.reports + a.messages));
  return <div className="manager-dashboard"><div className="manager-controls"><label>Date range<select value={range} onChange={(event) => setRange(event.target.value)}><option>Today</option><option>Last 7 days</option><option>Last 30 days</option><option>This quarter</option></select></label><span><ShieldCheck />Data respects role permissions and assignments</span></div><div className="manager-grid"><section><h3>Most active brokers</h3>{sorted.map((member) => <div key={member.id} className="broker-activity-row"><i>{member.initials}</i><span><strong>{member.name}</strong><small>{member.buyers} buyers · {member.reports} reports · {member.messages} messages</small></span><b>{member.followUps}</b></div>)}</section><section><h3>Most active areas</h3>{["Dubai Marina", "Dubai Hills", "Downtown Dubai", "Dubai Creek Harbour"].map((area, index) => <div key={area} className="area-activity-row"><span>{area}</span><strong>{42 - index * 7}</strong><i style={{ width: `${88 - index * 13}%` }} /></div>)}</section></div><section className="manager-assignment-strip"><h3>Buyer ownership</h3>{assignments.map((assignment) => <span key={assignment.buyerId}>{demoBuyers.find((buyer) => buyer.id === assignment.buyerId)?.name}<small>{members.find((member) => member.id === assignment.ownerId)?.name}</small></span>)}</section></div>;
}

function AgencyAdminDashboard({ notify }: { notify: (message: string) => void }) {
  const [brandingLocked, setBrandingLocked] = useState(true);
  return <div className="agency-admin-grid"><section className="agency-admin-card"><Users /><h3>Users & roles</h3><p>Manage users, roles, permissions and workspace access.</p><button onClick={() => notify("User management opened")}>Manage users</button></section><section className="agency-admin-card"><Palette /><h3>Branding</h3><p>Agency can lock logo, colours, footer, disclaimer and report cover style.</p><button className={brandingLocked ? "active" : ""} onClick={() => { setBrandingLocked(!brandingLocked); notify("Agency branding lock updated"); }}>{brandingLocked ? "Brand locked" : "Brand unlocked"}</button></section><section className="agency-admin-card"><FileText /><h3>Templates</h3><p>Set default approved templates for agents and teams.</p><button onClick={() => notify("Template manager opened")}>Manage templates</button></section><section className="agency-admin-card"><BarChart3 /><h3>Plan and usage</h3><p>Reports, AI generations, exports, users and active limits.</p><button onClick={() => notify("Usage dashboard opened")}>View usage</button></section><section className="agency-admin-card"><Settings /><h3>Data settings</h3><p>Import permissions, shared inventory policy and private-note rules.</p><button onClick={() => notify("Data settings saved")}>Configure data</button></section><section className="agency-admin-card"><ClipboardList /><h3>Reports</h3><p>Report visibility, approval status, public links and broker output.</p><button onClick={() => notify("Report governance opened")}>Manage reports</button></section><section className="agency-admin-card"><Download /><h3>Exports</h3><p>Export buyers, reports, activity, saved searches and property data.</p><button onClick={() => notify("Agency export prepared")}>Export data</button></section><section className="agency-admin-card"><Lock /><h3>Compliance & audit logs</h3><p>Configure disclaimers, review audit logs and enforce locked fields.</p><button onClick={() => notify("Compliance settings opened")}>Open compliance</button></section></div>;
}

function InviteMemberModal({ member, onClose, onSave }: { member?: TeamMemberRecord; onClose: () => void; onSave: (member: TeamMemberRecord) => void }) {
  const [draft, setDraft] = useState<TeamMemberRecord>(member ?? { id: `mem_${Date.now()}`, name: "", email: "", initials: "", role: "Broker / Agent", status: "Invited", buyers: 0, reports: 0, messages: 0, followUps: 0, lastActive: "Invitation pending", canImport: false });
  return <UiModal title={member ? "Edit team member" : "Invite team member"} subtitle="Invitee receives an email, role is assigned, and access is scoped to this workspace." onClose={onClose}><form className="crud-form" onSubmit={(event) => { event.preventDefault(); const initials = draft.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); onSave({ ...draft, initials: initials || "TM" }); }}><div className="crud-grid"><label className="span-2">Full name<input required value={draft.name} disabled={Boolean(member)} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><label className="span-2">Email<input required type="email" value={draft.email} disabled={Boolean(member)} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label><label>Role<select value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value as MemberRole })}><option>Admin</option><option>Manager</option><option>Broker / Agent</option><option>Viewer</option></select></label><label className="checkbox-card"><input type="checkbox" checked={draft.canImport} onChange={(event) => setDraft({ ...draft, canImport: event.target.checked })} />Can import shared listings</label></div><FormActions onCancel={onClose} submitLabel={member ? "Save role" : "Send invite email"} /></form></UiModal>;
}

function Kpi({ label, value, detail }: { label: string; value: string; detail: string }) { return <article><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
function summarizeTeam(members: TeamMemberRecord[]) { return { activeBrokers: members.filter((member) => member.status === "Active" && member.role !== "Viewer").length, buyers: members.reduce((sum, member) => sum + member.buyers, 0), reports: members.reduce((sum, member) => sum + member.reports, 0), messages: members.reduce((sum, member) => sum + member.messages, 0), followUps: members.reduce((sum, member) => sum + member.followUps, 0) }; }
function iconForTab(tab: Tab) { return tab === "Team" ? <UserPlus /> : tab === "Shared database" ? <Building2 /> : tab === "Assignments" ? <UserCheck /> : tab === "Report visibility" ? <FileText /> : tab === "Manager dashboard" ? <BarChart3 /> : <ShieldCheck />; }
