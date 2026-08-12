import { tags } from "typia";

/**
 * Membership public identity and lifecycle shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Exposes the caller-visible membership contract.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:memberships Represents the persisted memberships model.
 * @evidenceReview prisma:memberships Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IMembership {
  /** id.
   * @evidence prisma:memberships.id Carries the persisted id value.
   * @evidenceReview prisma:memberships.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** userId.
   * @evidence prisma:memberships.user_id Carries the persisted user_id value.
   * @evidenceReview prisma:memberships.user_id Read the DTO property and compared its type with the cited Prisma column.
   */
  userId: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:memberships.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:memberships.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** status.
   * @evidence prisma:memberships.status Carries the persisted status value.
   * @evidenceReview prisma:memberships.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: string;
  /** createdAt.
   * @evidence prisma:memberships.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:memberships.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:memberships.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:memberships.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: string & tags.Format<"date-time">;
}

