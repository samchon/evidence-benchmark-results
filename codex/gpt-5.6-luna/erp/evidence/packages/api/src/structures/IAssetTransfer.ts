import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:asset_transfers Exposes the persisted asset_transfers record.
 */
export interface IAssetTransfer {
  /** @evidence prisma:asset_transfers.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:asset_transfers.fixed_asset_id Carries the persisted fixedAssetId value. */
  fixedAssetId: string & tags.Format<"uuid">;
  /** @evidence prisma:asset_transfers.from_location_id Carries the persisted fromLocationId value. */
  fromLocationId: null | string;
  /** @evidence prisma:asset_transfers.to_location_id Carries the persisted toLocationId value. */
  toLocationId: null | string;
  /** @evidence prisma:asset_transfers.from_employee_id Carries the persisted fromEmployeeId value. */
  fromEmployeeId: null | string;
  /** @evidence prisma:asset_transfers.to_employee_id Carries the persisted toEmployeeId value. */
  toEmployeeId: null | string;
  /** @evidence prisma:asset_transfers.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:asset_transfers.transfer_date Carries the persisted transferDate value. */
  transferDate: string & tags.Format<"date-time">;
  /** @evidence prisma:asset_transfers.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:asset_transfers.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IAssetTransfer { export interface ICreate { fixedAssetId: string & tags.Format<"uuid">; fromLocationId?: null | string; toLocationId?: null | string; fromEmployeeId?: null | string; toEmployeeId?: null | string; transferDate: string & tags.Format<"date-time">; } export interface IRequest extends IPage.IRequest { fixedAssetId?: string; status?: string; } export interface IStatus { status: "draft" | "posted" | "cancelled"; } }
