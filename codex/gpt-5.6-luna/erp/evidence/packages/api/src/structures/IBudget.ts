import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Budget public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-budget-budget-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-budget-budget-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:budgets Represents the persisted budgets model.
 * @evidenceReview prisma:budgets Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IBudget extends IErpRecord {
  /** id.
   * @evidence prisma:budgets.id Carries the persisted id value.
   * @evidenceReview prisma:budgets.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:budgets.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:budgets.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:budgets.name Carries the persisted name value.
   * @evidenceReview prisma:budgets.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:budgets.status Carries the persisted status value.
   * @evidenceReview prisma:budgets.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:budgets.description Carries the persisted description value.
   * @evidenceReview prisma:budgets.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:budgets.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:budgets.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:budgets.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:budgets.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:budgets.amount Carries the persisted amount value.
   * @evidenceReview prisma:budgets.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:budgets.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:budgets.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:budgets.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:budgets.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:budgets.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:budgets.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:budgets.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:budgets.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
