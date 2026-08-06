import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:asset_disposals Exposes the persisted asset_disposals record.
 */
export interface IAssetDisposal {
  /** @evidence prisma:asset_disposals.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:asset_disposals.fixed_asset_id Carries the persisted fixedAssetId value. */
  fixedAssetId: string & tags.Format<"uuid">;
  /** @evidence prisma:asset_disposals.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:asset_disposals.disposal_date Carries the persisted disposalDate value. */
  disposalDate: string & tags.Format<"date-time">;
  /** @evidence prisma:asset_disposals.proceeds Carries the persisted proceeds value. */
  proceeds: null | number;
  /** @evidence prisma:asset_disposals.reason Carries the persisted reason value. */
  reason: null | string;
  /** @evidence prisma:asset_disposals.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:asset_disposals.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IAssetDisposal { export interface ICreate { fixedAssetId: string & tags.Format<"uuid">; disposalDate: string & tags.Format<"date-time">; proceeds?: null | number; reason?: null | string; } export interface IRequest extends IPage.IRequest { fixedAssetId?: string; status?: string; } export interface IStatus { status: "draft" | "posted" | "cancelled"; } }
