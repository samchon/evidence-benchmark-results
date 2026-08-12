import { tags } from "typia";

/**
 * Role public identity and lifecycle shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Exposes the caller-visible role contract.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:roles Represents the persisted roles model.
 * @evidenceReview prisma:roles Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IRole {
  /** id.
   * @evidence prisma:roles.id Carries the persisted id value.
   * @evidenceReview prisma:roles.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:roles.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:roles.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: null | (string & tags.Format<"uuid">);
  /** name.
   * @evidence prisma:roles.name Carries the persisted name value.
   * @evidenceReview prisma:roles.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: string;
  /** kind.
   * @evidence prisma:roles.kind Carries the persisted kind value.
   * @evidenceReview prisma:roles.kind Read the DTO property and compared its type with the cited Prisma column.
   */
  kind: string;
  /** permissions.
   * @evidence prisma:roles.permissions Carries the persisted permissions value.
   * @evidenceReview prisma:roles.permissions Read the DTO property and compared its type with the cited Prisma column.
   */
  permissions: string;
  /** createdAt.
   * @evidence prisma:roles.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:roles.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:roles.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:roles.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: string & tags.Format<"date-time">;
}

