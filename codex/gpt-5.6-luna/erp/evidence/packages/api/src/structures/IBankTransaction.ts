import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * BankTransaction public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-bank-transaction-bank-transaction-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-bank-transaction-bank-transaction-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:bank_transactions Represents the persisted bank_transactions model.
 * @evidenceReview prisma:bank_transactions Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IBankTransaction extends IErpRecord {
  /** id.
   * @evidence prisma:bank_transactions.id Carries the persisted id value.
   * @evidenceReview prisma:bank_transactions.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:bank_transactions.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:bank_transactions.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:bank_transactions.name Carries the persisted name value.
   * @evidenceReview prisma:bank_transactions.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:bank_transactions.status Carries the persisted status value.
   * @evidenceReview prisma:bank_transactions.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:bank_transactions.description Carries the persisted description value.
   * @evidenceReview prisma:bank_transactions.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:bank_transactions.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:bank_transactions.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:bank_transactions.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:bank_transactions.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:bank_transactions.amount Carries the persisted amount value.
   * @evidenceReview prisma:bank_transactions.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:bank_transactions.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:bank_transactions.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:bank_transactions.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:bank_transactions.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:bank_transactions.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:bank_transactions.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:bank_transactions.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:bank_transactions.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
