import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:shipments Exposes the persisted shipments record.
 */
export interface IShipment {
  /** @evidence prisma:shipments.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:shipments.sales_order_id Carries the persisted salesOrderId value. */
  salesOrderId: string & tags.Format<"uuid">;
  /** @evidence prisma:shipments.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:shipments.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:shipments.shipped_at Carries the persisted shippedAt value. */
  shippedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:shipments.delivered_at Carries the persisted deliveredAt value. */
  deliveredAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:shipments.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:shipments.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IShipment { export interface ICreate { salesOrderId: string & tags.Format<"uuid">; lines?: ILine[]; } export interface ILine { salesOrderLineId: string & tags.Format<"uuid">; itemId?: null | string; quantity: number; warehouseId?: null | string; locationId?: null | string; } export interface IRequest extends IPage.IRequest { salesOrderId?: string; status?: string; } export interface IStatus { status: "draft" | "picked" | "packed" | "shipped" | "delivered" | "cancelled"; } }
