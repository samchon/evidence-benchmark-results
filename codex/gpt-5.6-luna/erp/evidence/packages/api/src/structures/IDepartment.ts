import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Department public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-department-departments Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-department-departments Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:departments Represents the persisted departments model.
 * @evidenceReview prisma:departments Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IDepartment extends IErpRecord {
  /** id.
   * @evidence prisma:departments.id Carries the persisted id value.
   * @evidenceReview prisma:departments.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:departments.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:departments.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:departments.name Carries the persisted name value.
   * @evidenceReview prisma:departments.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:departments.status Carries the persisted status value.
   * @evidenceReview prisma:departments.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:departments.description Carries the persisted description value.
   * @evidenceReview prisma:departments.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:departments.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:departments.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:departments.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:departments.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:departments.amount Carries the persisted amount value.
   * @evidenceReview prisma:departments.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:departments.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:departments.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:departments.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:departments.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:departments.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:departments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:departments.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:departments.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
