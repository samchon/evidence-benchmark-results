import type { tags } from "typia";
/**
 * @evidence prisma:purchase_request_lines Exposes the persisted purchase_request_lines record.
 */
export interface IPurchaseRequestLine {
  /** @evidence prisma:purchase_request_lines.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_request_lines.purchase_request_id Carries the persisted purchaseRequestId value. */
  purchaseRequestId: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_request_lines.item_id Carries the persisted itemId value. */
  itemId: null | string;
  /** @evidence prisma:purchase_request_lines.description Carries the persisted description value. */
  description: string;
  /** @evidence prisma:purchase_request_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:purchase_request_lines.unit_code Carries the persisted unitCode value. */
  unitCode: string;
  /** @evidence prisma:purchase_request_lines.estimated_unit_cost Carries the persisted estimatedUnitCost value. */
  estimatedUnitCost: number;
  /** @evidence prisma:purchase_request_lines.preferred_vendor_id Carries the persisted preferredVendorId value. */
  preferredVendorId: null | string;
  /** @evidence prisma:purchase_request_lines.converted_quantity Carries the persisted convertedQuantity value. */
  convertedQuantity: number;
  /** @evidence prisma:purchase_request_lines.remaining_quantity Carries the persisted remainingQuantity value. */
  remainingQuantity: number;
  /** @evidence prisma:purchase_request_lines.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:purchase_request_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPurchaseRequestLine { export interface ICreate { itemId?: null | string; description: string; quantity: number; unitCode: string; estimatedUnitCost: number; preferredVendorId?: null | string; } }
