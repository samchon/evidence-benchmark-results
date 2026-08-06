import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:asset_impairments Exposes the persisted asset_impairments record.
 */
export interface IAssetImpairment {
  /** @evidence prisma:asset_impairments.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:asset_impairments.fixed_asset_id Carries the persisted fixedAssetId value. */
  fixedAssetId: string & tags.Format<"uuid">;
  /** @evidence prisma:asset_impairments.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:asset_impairments.impairment_date Carries the persisted impairmentDate value. */
  impairmentDate: string & tags.Format<"date-time">;
  /** @evidence prisma:asset_impairments.amount Carries the persisted amount value. */
  amount: number;
  /** @evidence prisma:asset_impairments.reason Carries the persisted reason value. */
  reason: null | string;
  /** @evidence prisma:asset_impairments.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:asset_impairments.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IAssetImpairment { export interface ICreate { fixedAssetId: string & tags.Format<"uuid">; impairmentDate: string & tags.Format<"date-time">; amount: number; reason?: null | string; } export interface IRequest extends IPage.IRequest { fixedAssetId?: string; status?: string; } export interface IStatus { status: "draft" | "posted" | "cancelled"; } }
