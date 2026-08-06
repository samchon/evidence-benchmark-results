import type { tags } from "typia";
import type { IPage } from "../typings";
/** Organization tax jurisdiction. */
/**
 * @evidence prisma:tax_jurisdictions Exposes the persisted tax_jurisdictions record.
 */
export interface ITaxJurisdiction {
  /** @evidence prisma:tax_jurisdictions.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:tax_jurisdictions.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:tax_jurisdictions.territory Carries the persisted territory value. */
  territory: string;
  /** @evidence prisma:tax_jurisdictions.active Carries the persisted active value. */
  active: boolean;
  /** @evidence prisma:tax_jurisdictions.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:tax_jurisdictions.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ITaxJurisdiction { export interface ICreate { name: string & tags.MinLength<1>; territory: string & tags.MinLength<1>; } export interface IUpdate { name?: string; territory?: string; } export interface IRequest extends IPage.IRequest { search?: string; includeInactive?: boolean; } }
