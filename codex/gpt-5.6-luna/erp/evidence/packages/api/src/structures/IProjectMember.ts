import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * ProjectMember public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-project-member-project-membership Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-project-member-project-membership Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:project_members Represents the persisted project_members model.
 * @evidenceReview prisma:project_members Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IProjectMember extends IErpRecord {
  /** id.
   * @evidence prisma:project_members.id Carries the persisted id value.
   * @evidenceReview prisma:project_members.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:project_members.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:project_members.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:project_members.name Carries the persisted name value.
   * @evidenceReview prisma:project_members.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:project_members.status Carries the persisted status value.
   * @evidenceReview prisma:project_members.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:project_members.description Carries the persisted description value.
   * @evidenceReview prisma:project_members.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:project_members.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:project_members.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:project_members.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:project_members.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:project_members.amount Carries the persisted amount value.
   * @evidenceReview prisma:project_members.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:project_members.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:project_members.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:project_members.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:project_members.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:project_members.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:project_members.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:project_members.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:project_members.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
