import type { tags } from "typia";

/** Publicly exposed subset of the persisted global user record.
 * @evidence prisma:users The authentication contract exposes the safe user profile subset.
 */
export interface IUserEvidence {
  /** @evidence prisma:users.id Carries the persisted user identifier. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:users.email Carries the persisted login email. */
  email: string & tags.Format<"email">;
  /** @evidence prisma:users.display_name Carries the persisted display name. */
  displayName: string;
  /** @evidence prisma:users.avatar Carries the persisted avatar reference. */
  avatar: null | string;
  /** @evidence prisma:users.phone Carries the persisted phone number. */
  phone: null | string;
  /** @evidence prisma:users.locale Carries the persisted locale. */
  locale: string;
  /** @evidence prisma:users.timezone Carries the persisted timezone. */
  timezone: string;
  /** @evidence prisma:users.active Carries the persisted activation state. */
  active: boolean;
}
