import type { tags } from "typia";

/** One user's organization-scoped membership. */
/**
 * @evidence prisma:memberships Exposes the persisted memberships record.
 */
export interface IMembership {
  /** Membership UUID. */
  /** @evidence prisma:memberships.id Carries the persisted id value. */ id: string & tags.Format<"uuid">;
  /** Organization UUID. */
  /** @evidence prisma:memberships.organization_id Carries the persisted organizationId value. */
  organizationId: string & tags.Format<"uuid">;
  /** Organization display name. */
  organizationName: string;
  /** Membership lifecycle state. */
  /** @evidence prisma:memberships.status Carries the persisted lifecycle state. */ status: "invited" | "active" | "suspended" | "revoked";
  /** Employee baseline role. */
  /** @evidence prisma:memberships.baseline_role Carries the persisted baselineRole value. */
  baselineRole: string;
  /** Assigned role names. */
  roles: string[];
  /** Creation instant. */
  /** @evidence prisma:memberships.created_at Carries the persisted creation instant. */ createdAt: string & tags.Format<"date-time">;
  /** Last lifecycle update instant. */
  /** @evidence prisma:memberships.updated_at Carries the persisted update instant. */ updatedAt: string & tags.Format<"date-time">;
  /** Invitation proof when this row was just issued through the delivery adapter. */
  invitationToken?: string;
}

export namespace IMembership {
  /** Owner-issued invitation input. */
  export interface IInvite {
    /** Recipient email. */
    email: string & tags.Format<"email">;
    /** Initial role; defaults to Employee. */
    initialRole?: null | string;
  }

  /** Session context selection input. */
  export interface ISelect {
    /** Active membership to use as organization context. */
    membershipId: string & tags.Format<"uuid">;
  }

  /** Membership state transition input. */
  export interface IStatus {
    /** New lifecycle state accepted by the command. */
    status: "active" | "suspended" | "revoked";
  }
}
