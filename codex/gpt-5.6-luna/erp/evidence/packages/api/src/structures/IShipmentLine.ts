import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:shipment_lines Exposes the persisted shipment_lines record.
 */
export interface IShipmentLine {
  /** @evidence prisma:shipment_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:shipment_lines.shipment_id Carries the persisted shipmentId value. */
  shipmentId: Id;
  /** @evidence prisma:shipment_lines.sales_order_line_id Carries the persisted salesOrderLineId value. */
  salesOrderLineId: Id;
  /** @evidence prisma:shipment_lines.item_id Carries the persisted itemId value. */
  itemId: null|Id;
  /** @evidence prisma:shipment_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:shipment_lines.warehouse_id Carries the persisted warehouseId value. */
  warehouseId: null|Id;
  /** @evidence prisma:shipment_lines.location_id Carries the persisted locationId value. */
  locationId: null|Id;
  /** @evidence prisma:shipment_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
  /** @evidence prisma:shipment_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string&tags.Format<"date-time">;
} export namespace IShipmentLine { export interface ICreate { shipmentId:Id; salesOrderLineId:Id; itemId?:null|Id; quantity:number; warehouseId?:null|Id; locationId?:null|Id; } export interface IRequest extends IPage.IRequest { shipmentId?:Id; salesOrderLineId?:Id; } }
