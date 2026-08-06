import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:asset_categories Exposes the persisted asset_categories record.
 */
export interface IAssetCategory {
  /** @evidence prisma:asset_categories.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:asset_categories.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:asset_categories.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:asset_categories.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:asset_categories.useful_life_months Carries the persisted usefulLifeMonths value. */
  usefulLifeMonths: number;
  /** @evidence prisma:asset_categories.depreciation_method Carries the persisted depreciationMethod value. */
  depreciationMethod: string;
  /** @evidence prisma:asset_categories.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:asset_categories.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IAssetCategory { export interface ICreate { code: string; name: string; usefulLifeMonths: number; depreciationMethod: string; } export interface IRequest extends IPage.IRequest { status?: string; } export interface IStatus { status: "active" | "inactive"; } }
