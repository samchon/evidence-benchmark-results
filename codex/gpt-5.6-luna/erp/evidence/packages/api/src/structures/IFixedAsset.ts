import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:fixed_assets Exposes the persisted fixed_assets record.
 */
export interface IFixedAsset {
  /** @evidence prisma:fixed_assets.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:fixed_assets.asset_category_id Carries the persisted assetCategoryId value. */
  assetCategoryId: null | string;
/** @evidence prisma:fixed_assets.asset_tag Carries the persisted assetTag value. */
  assetTag: string;
/** @evidence prisma:fixed_assets.name Carries the persisted name value. */
  name: string;
/** @evidence prisma:fixed_assets.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:fixed_assets.acquisition_date Carries the persisted acquisitionDate value. */
  acquisitionDate: string & tags.Format<"date-time">;
/** @evidence prisma:fixed_assets.acquisition_cost Carries the persisted acquisitionCost value. */
  acquisitionCost: number;
/** @evidence prisma:fixed_assets.accumulated_depreciation Carries the persisted accumulatedDepreciation value. */
  accumulatedDepreciation: number;
/** @evidence prisma:fixed_assets.net_book_value Carries the persisted netBookValue value. */
  netBookValue: number;
/** @evidence prisma:fixed_assets.location_id Carries the persisted locationId value. */
  locationId: null | string;
/** @evidence prisma:fixed_assets.custodian_employee_id Carries the persisted custodianEmployeeId value. */
  custodianEmployeeId: null | string;
/** @evidence prisma:fixed_assets.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:fixed_assets.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IFixedAsset { export interface ICreate { assetCategoryId?: null | string; assetTag: string; name: string; acquisitionDate: string & tags.Format<"date-time">; acquisitionCost: number; locationId?: null | string; custodianEmployeeId?: null | string; } export interface IRequest extends IPage.IRequest { status?: string; assetCategoryId?: string; } export interface IStatus { status: "registered" | "in_service" | "disposed" | "impaired"; } }
