import { tags } from "typia";

/**
 * SystemPrincipal public identity and lifecycle shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-principal-acting-principals Exposes the caller-visible systemprincipal contract.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-principal-acting-principals Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:system_principals Represents the persisted system_principals model.
 * @evidenceReview prisma:system_principals Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ISystemPrincipal {
  /** id.
   * @evidence prisma:system_principals.id Carries the persisted id value.
   * @evidenceReview prisma:system_principals.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:system_principals.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:system_principals.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:system_principals.name Carries the persisted name value.
   * @evidenceReview prisma:system_principals.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: string;
  /** createdAt.
   * @evidence prisma:system_principals.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:system_principals.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
}

