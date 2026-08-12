import { tags } from "typia";

/**
 * Authentication result that exposes authority state without secrets.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Represents the caller-visible authentication and authority result.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:sessions Represents the durable session boundary without exposing refresh_digest.
 * @evidenceReview prisma:sessions Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IAuthRecord {
  /** Durable result identity. */
  id: string & tags.Format<"uuid">;
  /** Result kind, such as invitation, membership, session, or role. */
  kind: string;
  /** Lifecycle or refusal status. */
  status: string;
  /** Organization selected by the command, when applicable. */
  organizationId: null | (string & tags.Format<"uuid">);
  /** Global user selected by the command, when applicable. */
  userId: null | (string & tags.Format<"uuid">);
  /** Membership selected by the command, when applicable. */
  membershipId: null | (string & tags.Format<"uuid">);
  /** Role selected by the command, when applicable. */
  roleId: null | (string & tags.Format<"uuid">);
  /** Session selected by the command, when applicable. */
  sessionId: null | (string & tags.Format<"uuid">);
  /** Invitation selected by the command, when applicable. */
  invitationId: null | (string & tags.Format<"uuid">);
  /** Safe account email, when applicable. */
  email: null | (string & tags.Format<"email">);
  /** Safe display or role name, when applicable. */
  name: null | string;
  /** Opaque access credential returned after successful authentication. */
  accessToken: null | string;
  /** Opaque refresh credential returned after successful authentication. */
  refreshToken: null | string;
  /** Session expiry, when a session is issued. */
  expiresAt: null | (string & tags.Format<"date-time">);
  /** Creation instant of the result. */
  createdAt: string & tags.Format<"date-time">;
  /** Last lifecycle update. */
  updatedAt: string & tags.Format<"date-time">;
  /** Retention marker. */
  deletedAt: null | (string & tags.Format<"date-time">);
}
