import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:transfers Exposes the persisted transfers record.
 */
export interface ITransfer {
  /** @evidence prisma:transfers.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:transfers.source_warehouse_id Carries the persisted sourceWarehouseId value. */
  sourceWarehouseId: string & tags.Format<"uuid">;
/** @evidence prisma:transfers.destination_warehouse_id Carries the persisted destinationWarehouseId value. */
  destinationWarehouseId: string & tags.Format<"uuid">;
  /** @evidence prisma:transfers.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:transfers.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:transfers.shipped_at Carries the persisted shippedAt value. */
  shippedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:transfers.received_at Carries the persisted receivedAt value. */
  receivedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:transfers.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:transfers.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ITransfer { export interface ICreate { sourceWarehouseId: string & tags.Format<"uuid">; destinationWarehouseId: string & tags.Format<"uuid">; } export interface IRequest extends IPage.IRequest { status?: string; } export interface IStatus { status: "draft" | "shipped" | "partly_received" | "received" | "cancelled"; } }
