import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * CreditMemo public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-credit-memo-credit-memos Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-credit-memo-credit-memos Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:credit_memos Represents the persisted credit_memos model.
 * @evidenceReview prisma:credit_memos Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ICreditMemo extends IErpRecord {
  /** id.
   * @evidence prisma:credit_memos.id Carries the persisted id value.
   * @evidenceReview prisma:credit_memos.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:credit_memos.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:credit_memos.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:credit_memos.name Carries the persisted name value.
   * @evidenceReview prisma:credit_memos.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:credit_memos.status Carries the persisted status value.
   * @evidenceReview prisma:credit_memos.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:credit_memos.description Carries the persisted description value.
   * @evidenceReview prisma:credit_memos.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:credit_memos.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:credit_memos.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:credit_memos.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:credit_memos.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:credit_memos.amount Carries the persisted amount value.
   * @evidenceReview prisma:credit_memos.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:credit_memos.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:credit_memos.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:credit_memos.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:credit_memos.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:credit_memos.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:credit_memos.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:credit_memos.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:credit_memos.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
