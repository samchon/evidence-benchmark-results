import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * BankReconciliation public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-reconciliation-bank-reconciliation-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-reconciliation-bank-reconciliation-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:bank_reconciliations Represents the persisted bank_reconciliations model.
 * @evidenceReview prisma:bank_reconciliations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IBankReconciliation extends IErpRecord {
  /** id.
   * @evidence prisma:bank_reconciliations.id Carries the persisted id value.
   * @evidenceReview prisma:bank_reconciliations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:bank_reconciliations.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:bank_reconciliations.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:bank_reconciliations.name Carries the persisted name value.
   * @evidenceReview prisma:bank_reconciliations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:bank_reconciliations.status Carries the persisted status value.
   * @evidenceReview prisma:bank_reconciliations.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:bank_reconciliations.description Carries the persisted description value.
   * @evidenceReview prisma:bank_reconciliations.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:bank_reconciliations.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:bank_reconciliations.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:bank_reconciliations.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:bank_reconciliations.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:bank_reconciliations.amount Carries the persisted amount value.
   * @evidenceReview prisma:bank_reconciliations.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:bank_reconciliations.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:bank_reconciliations.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:bank_reconciliations.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:bank_reconciliations.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:bank_reconciliations.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:bank_reconciliations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:bank_reconciliations.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:bank_reconciliations.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
