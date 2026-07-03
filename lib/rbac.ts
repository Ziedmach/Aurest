import type { WorkspaceType } from "@/lib/workspace";

export type Role = "Owner" | "Admin" | "Manager" | "Broker / Agent" | "Viewer";

export type Permission =
  | "workspace.view"
  | "workspace.manage"
  | "users.manage"
  | "branding.manage"
  | "templates.manage"
  | "exports.manage"
  | "billing.manage"
  | "admin.access"
  | "security.view"
  | "activity.view"
  | "team.activity.view"
  | "buyers.access"
  | "buyers.manage.assigned"
  | "properties.access"
  | "properties.manage.assigned"
  | "reports.access"
  | "reports.manage.own"
  | "matching.access"
  | "content.access"
  | "searches.access"
  | "market.access"
  | "analytics.access"
  | "dataQuality.access"
  | "integrations.access"
  | "settings.access";

export const allRoles: Role[] = ["Owner", "Admin", "Manager", "Broker / Agent", "Viewer"];

export const roleDefinitions: Array<{
  role: Role;
  description: string;
  workspace: boolean;
  branding: boolean;
  members: boolean;
  buyers: string;
  reports: string;
  permissions: Permission[];
}> = [
  {
    role: "Owner",
    description: "Full workspace owner. Can manage settings, billing, members, data, and exports.",
    workspace: true,
    branding: true,
    members: true,
    buyers: "All",
    reports: "All",
    permissions: [],
  },
  {
    role: "Admin",
    description: "Agency/team administrator. Can manage users, branding, templates, exports, and usage.",
    workspace: true,
    branding: true,
    members: true,
    buyers: "All",
    reports: "All",
    permissions: [
      "workspace.view",
      "users.manage",
      "branding.manage",
      "templates.manage",
      "exports.manage",
      "billing.manage",
      "admin.access",
      "security.view",
      "activity.view",
      "team.activity.view",
      "buyers.access",
      "properties.access",
      "reports.access",
      "matching.access",
      "content.access",
      "searches.access",
      "market.access",
      "analytics.access",
      "dataQuality.access",
      "integrations.access",
      "settings.access",
    ],
  },
  {
    role: "Manager",
    description: "Can inspect assigned team activity and manage team-scoped buyers, properties, and reports.",
    workspace: false,
    branding: false,
    members: false,
    buyers: "Team",
    reports: "Team",
    permissions: [
      "activity.view",
      "team.activity.view",
      "buyers.access",
      "buyers.manage.assigned",
      "properties.access",
      "properties.manage.assigned",
      "reports.access",
      "reports.manage.own",
      "matching.access",
      "content.access",
      "searches.access",
      "market.access",
      "analytics.access",
      "dataQuality.access",
    ],
  },
  {
    role: "Broker / Agent",
    description: "Can manage assigned buyers, shared properties, own reports, sales content, and saved searches.",
    workspace: false,
    branding: false,
    members: false,
    buyers: "Assigned",
    reports: "Own",
    permissions: [
      "activity.view",
      "buyers.access",
      "buyers.manage.assigned",
      "properties.access",
      "properties.manage.assigned",
      "reports.access",
      "reports.manage.own",
      "matching.access",
      "content.access",
      "searches.access",
      "market.access",
      "analytics.access",
      "dataQuality.access",
    ],
  },
  {
    role: "Viewer",
    description: "Read-only role. Can view explicitly permitted buyers, properties, reports, and market context.",
    workspace: false,
    branding: false,
    members: false,
    buyers: "Permitted",
    reports: "Permitted",
    permissions: ["activity.view", "buyers.access", "properties.access", "reports.access", "market.access"],
  },
];

export const pageAccessMap: Array<{ page: string; permission: Permission; description: string }> = [
  { page: "Buyers", permission: "buyers.access", description: "Buyer list, profile detail, buyer status, and notes." },
  { page: "Properties", permission: "properties.access", description: "Property grid, details, notes, collections, and shortlist views." },
  { page: "Recommendations", permission: "matching.access", description: "Buyer-to-property matching and fit matrix." },
  { page: "Reports", permission: "reports.access", description: "Report studio, report library, PDF/public link workflows." },
  { page: "Sales copilot", permission: "content.access", description: "WhatsApp, email, call scripts, follow-ups, and objections." },
  { page: "Saved searches", permission: "searches.access", description: "Saved search builder, buyer-linked searches, and match feed." },
  { page: "Market intel", permission: "market.access", description: "Benchmarks, comparables, yield estimates, and neighbourhood intelligence." },
  { page: "Analytics", permission: "analytics.access", description: "Solo/team analytics and demand insights." },
  { page: "Data quality", permission: "dataQuality.access", description: "Quality scoring, duplicate review, and freshness checks." },
  { page: "Integrations", permission: "integrations.access", description: "Exports, webhooks, WhatsApp, imports, and brochure extraction." },
  { page: "Billing", permission: "billing.manage", description: "Plan limits, subscription packaging, and usage overrides." },
  { page: "Compliance", permission: "security.view", description: "AI guardrails, disclaimer management, and output approval mode." },
  { page: "AI content", permission: "admin.access", description: "Prompt library, prompt versions, tests, restore, and workspace tone defaults." },
  { page: "Team analytics", permission: "team.activity.view", description: "Manager/team activity dashboard and broker comparison." },
  { page: "Activity", permission: "activity.view", description: "Immutable audit log visibility." },
  { page: "Workspace", permission: "workspace.view", description: "Workspace profile, branding, members, and upgrade path." },
  { page: "Security", permission: "security.view", description: "Sessions, access simulation, and audit controls." },
  { page: "Admin", permission: "admin.access", description: "Agency admin dashboard and platform/admin controls." },
  { page: "Settings", permission: "settings.access", description: "Workspace controls, usage, and backend readiness." },
];

export function workspaceRoleOptions(type: WorkspaceType): Role[] {
  if (type === "solo") return ["Owner"];
  if (type === "team") return ["Owner", "Broker / Agent"];
  return allRoles;
}

export function isRoleAllowedInWorkspace(role: Role, type: WorkspaceType) {
  return workspaceRoleOptions(type).includes(role);
}

export function hasPermission(role: Role, permission: Permission) {
  if (role === "Owner") return true;
  return roleDefinitions.find((item) => item.role === role)?.permissions.includes(permission) ?? false;
}

export function roleScopeSummary(role: Role) {
  const definition = roleDefinitions.find((item) => item.role === role) ?? roleDefinitions[4];
  return {
    buyers: definition.buyers === "All" ? "All workspace buyers" : definition.buyers === "Team" ? "Assigned team buyers" : definition.buyers === "Assigned" ? "Assigned + created buyers" : "Explicitly permitted buyers",
    properties: definition.role === "Viewer" ? "Read-only permitted inventory" : definition.role === "Owner" || definition.role === "Admin" ? "All workspace inventory" : "Shared + assigned inventory",
    reports: definition.reports === "All" ? "All reports" : definition.reports === "Team" ? "Team reports" : definition.reports === "Own" ? "Own reports" : "Read-only permitted reports",
    admin: definition.role === "Owner" || definition.role === "Admin",
    description: definition.description,
  };
}

export function canAccessPage(role: Role, workspaceType: WorkspaceType, page: string) {
  if (!isRoleAllowedInWorkspace(role, workspaceType)) {
    return {
      allowed: false,
      reason: `${role} is not an active role for ${workspaceType} workspaces.`,
    };
  }

  const policy = pageAccessMap.find((item) => item.page === page);
  if (!policy) return { allowed: true, reason: "No special restriction for this page." };

  const allowed = hasPermission(role, policy.permission);
  return {
    allowed,
    reason: allowed ? `${role} has ${policy.permission}.` : `${role} does not have permission for ${policy.description}`,
    permission: policy.permission,
  };
}

export function backendGuardExample(resource: string, permission: Permission) {
  return [
    `resolve_session(auth.token)`,
    `assert_membership(user_id, workspace_id)`,
    `assert_role_permission(active_role, "${permission}")`,
    `SELECT * FROM ${resource} WHERE workspace_id = current_workspace_id`,
  ];
}
