import { tags } from "typia";

/**
 * MembershipRole public identity and lifecycle shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Exposes the caller-visible membershiprole contract.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:membership_roles Represents the persisted membership_roles model.
 * @evidenceReview prisma:membership_roles Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IMembershipRole {
  /** id.
   * @evidence prisma:membership_roles.id Carries the persisted id value.
   * @evidenceReview prisma:membership_roles.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** membershipId.
   * @evidence prisma:membership_roles.membership_id Carries the persisted membership_id value.
   * @evidenceReview prisma:membership_roles.membership_id Read the DTO property and compared its type with the cited Prisma column.
   */
  membershipId: string & tags.Format<"uuid">;
  /** roleId.
   * @evidence prisma:membership_roles.role_id Carries the persisted role_id value.
   * @evidenceReview prisma:membership_roles.role_id Read the DTO property and compared its type with the cited Prisma column.
   */
  roleId: string & tags.Format<"uuid">;
  /** createdAt.
   * @evidence prisma:membership_roles.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:membership_roles.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
}

