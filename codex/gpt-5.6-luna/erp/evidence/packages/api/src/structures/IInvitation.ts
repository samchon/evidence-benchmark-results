import { tags } from "typia";

/**
 * Invitation public identity and lifecycle shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Exposes the caller-visible invitation contract.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:invitations Represents the persisted invitations model.
 * @evidenceReview prisma:invitations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IInvitation {
  /** id.
   * @evidence prisma:invitations.id Carries the persisted id value.
   * @evidenceReview prisma:invitations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:invitations.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:invitations.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** inviterId.
   * @evidence prisma:invitations.inviter_id Carries the persisted inviter_id value.
   * @evidenceReview prisma:invitations.inviter_id Read the DTO property and compared its type with the cited Prisma column.
   */
  inviterId: string & tags.Format<"uuid">;
  /** email.
   * @evidence prisma:invitations.email Carries the persisted email value.
   * @evidenceReview prisma:invitations.email Read the DTO property and compared its type with the cited Prisma column.
   */
  email: string & tags.Format<"email">;
  /** initialRole.
   * @evidence prisma:invitations.initial_role Carries the persisted initial_role value.
   * @evidenceReview prisma:invitations.initial_role Read the DTO property and compared its type with the cited Prisma column.
   */
  initialRole: string;
  /** status.
   * @evidence prisma:invitations.status Carries the persisted status value.
   * @evidenceReview prisma:invitations.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: string;
  /** createdAt.
   * @evidence prisma:invitations.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:invitations.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** acceptedAt.
   * @evidence prisma:invitations.accepted_at Carries the persisted accepted_at value.
   * @evidenceReview prisma:invitations.accepted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  acceptedAt: null | (string & tags.Format<"date-time">);
  /** revokedAt.
   * @evidence prisma:invitations.revoked_at Carries the persisted revoked_at value.
   * @evidenceReview prisma:invitations.revoked_at Read the DTO property and compared its type with the cited Prisma column.
   */
  revokedAt: null | (string & tags.Format<"date-time">);
}

