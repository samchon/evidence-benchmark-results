import { tags } from "typia";

/**
 * Session public identity and lifecycle shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Exposes the caller-visible session contract.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:sessions Represents the persisted sessions model.
 * @evidenceReview prisma:sessions Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ISession {
  /** id.
   * @evidence prisma:sessions.id Carries the persisted id value.
   * @evidenceReview prisma:sessions.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** userId.
   * @evidence prisma:sessions.user_id Carries the persisted user_id value.
   * @evidenceReview prisma:sessions.user_id Read the DTO property and compared its type with the cited Prisma column.
   */
  userId: string & tags.Format<"uuid">;
  /** membershipId.
   * @evidence prisma:sessions.membership_id Carries the persisted membership_id value.
   * @evidenceReview prisma:sessions.membership_id Read the DTO property and compared its type with the cited Prisma column.
   */
  membershipId: null | (string & tags.Format<"uuid">);
  /** expiresAt.
   * @evidence prisma:sessions.expires_at Carries the persisted expires_at value.
   * @evidenceReview prisma:sessions.expires_at Read the DTO property and compared its type with the cited Prisma column.
   */
  expiresAt: string & tags.Format<"date-time">;
  /** revokedAt.
   * @evidence prisma:sessions.revoked_at Carries the persisted revoked_at value.
   * @evidenceReview prisma:sessions.revoked_at Read the DTO property and compared its type with the cited Prisma column.
   */
  revokedAt: null | (string & tags.Format<"date-time">);
  /** createdAt.
   * @evidence prisma:sessions.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:sessions.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:sessions.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:sessions.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: string & tags.Format<"date-time">;
}

