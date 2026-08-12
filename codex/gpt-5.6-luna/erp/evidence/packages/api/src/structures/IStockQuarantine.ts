import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * StockQuarantine public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-quarantine-stock-quarantine-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-quarantine-stock-quarantine-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:stock_quarantines Represents the persisted stock_quarantines model.
 * @evidenceReview prisma:stock_quarantines Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IStockQuarantine extends IErpRecord {
  /** id.
   * @evidence prisma:stock_quarantines.id Carries the persisted id value.
   * @evidenceReview prisma:stock_quarantines.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:stock_quarantines.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:stock_quarantines.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:stock_quarantines.name Carries the persisted name value.
   * @evidenceReview prisma:stock_quarantines.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:stock_quarantines.status Carries the persisted status value.
   * @evidenceReview prisma:stock_quarantines.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:stock_quarantines.description Carries the persisted description value.
   * @evidenceReview prisma:stock_quarantines.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:stock_quarantines.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:stock_quarantines.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:stock_quarantines.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:stock_quarantines.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:stock_quarantines.amount Carries the persisted amount value.
   * @evidenceReview prisma:stock_quarantines.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:stock_quarantines.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:stock_quarantines.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:stock_quarantines.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:stock_quarantines.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:stock_quarantines.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:stock_quarantines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:stock_quarantines.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:stock_quarantines.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
