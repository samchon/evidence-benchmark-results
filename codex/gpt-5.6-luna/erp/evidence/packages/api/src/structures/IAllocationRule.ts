import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * AllocationRule public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-allocation-rule-allocation-rules Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-allocation-rule-allocation-rules Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:allocation_rules Represents the persisted allocation_rules model.
 * @evidenceReview prisma:allocation_rules Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IAllocationRule extends IErpRecord {
  /** id.
   * @evidence prisma:allocation_rules.id Carries the persisted id value.
   * @evidenceReview prisma:allocation_rules.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:allocation_rules.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:allocation_rules.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:allocation_rules.name Carries the persisted name value.
   * @evidenceReview prisma:allocation_rules.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:allocation_rules.status Carries the persisted status value.
   * @evidenceReview prisma:allocation_rules.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:allocation_rules.description Carries the persisted description value.
   * @evidenceReview prisma:allocation_rules.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:allocation_rules.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:allocation_rules.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:allocation_rules.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:allocation_rules.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:allocation_rules.amount Carries the persisted amount value.
   * @evidenceReview prisma:allocation_rules.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:allocation_rules.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:allocation_rules.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:allocation_rules.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:allocation_rules.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:allocation_rules.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:allocation_rules.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:allocation_rules.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:allocation_rules.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
