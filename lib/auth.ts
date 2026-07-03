import type { WorkspaceType } from "@/lib/workspace";
import type { Role } from "@/lib/rbac";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  workspaceId: string;
};

export type AuthSession = {
  id: string;
  user: AuthUser;
  issuedAt: string;
  expiresAt: string;
  device: string;
  ipHint: string;
  mfaEnabled: boolean;
  secureCookie: true;
};

export type SignupPayload = {
  name: string;
  email: string;
  workspaceName: string;
  workspaceType: WorkspaceType;
};

export function createDemoSession(user: Partial<AuthUser> & Pick<AuthUser, "name" | "email" | "workspaceId">): AuthSession {
  const issued = new Date();
  const expires = new Date(issued.getTime() + 8 * 60 * 60 * 1000);
  return {
    id: `ses_${Date.now()}`,
    user: { id: `usr_${Date.now()}`, role: "Owner", ...user },
    issuedAt: issued.toISOString(),
    expiresAt: expires.toISOString(),
    device: "Mac · In-app browser",
    ipHint: "Dubai, AE · 192.168.x.x",
    mfaEnabled: false,
    secureCookie: true,
  };
}
