import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * StockMovement public representation.
 * @evidence prisma:stock_movements Represents the persisted stock_movements model.
 * @evidenceReview prisma:stock_movements Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IStockMovement extends IErpRecord {
  /** id.
   * @evidence prisma:stock_movements.id Carries the persisted id value.
   * @evidenceReview prisma:stock_movements.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:stock_movements.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:stock_movements.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:stock_movements.name Carries the persisted name value.
   * @evidenceReview prisma:stock_movements.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:stock_movements.status Carries the persisted status value.
   * @evidenceReview prisma:stock_movements.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:stock_movements.description Carries the persisted description value.
   * @evidenceReview prisma:stock_movements.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:stock_movements.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:stock_movements.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:stock_movements.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:stock_movements.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:stock_movements.amount Carries the persisted amount value.
   * @evidenceReview prisma:stock_movements.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:stock_movements.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:stock_movements.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:stock_movements.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:stock_movements.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:stock_movements.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:stock_movements.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:stock_movements.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:stock_movements.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
