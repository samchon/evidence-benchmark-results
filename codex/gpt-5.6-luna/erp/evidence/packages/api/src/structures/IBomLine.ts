import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:bom_lines Exposes the persisted bom_lines record.
 */
export interface IBomLine {
  /** @evidence prisma:bom_lines.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:bom_lines.bom_id Carries the persisted bom_id value. */
  bomId: string & tags.Format<"uuid">;
/** @evidence prisma:bom_lines.component_item_id Carries the persisted componentItemId value. */
  componentItemId: string & tags.Format<"uuid">;
/** @evidence prisma:bom_lines.quantity Carries the persisted quantity value. */
  quantity: number;
/** @evidence prisma:bom_lines.unit_code Carries the persisted unitCode value. */
  unitCode: string;
/** @evidence prisma:bom_lines.scrap_percent Carries the persisted scrapPercent value. */
  scrapPercent: number;
/** @evidence prisma:bom_lines.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:bom_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IBomLine { export interface ICreate { bomId: string & tags.Format<"uuid">; componentItemId: string & tags.Format<"uuid">; quantity: number; unitCode: string; scrapPercent?: number; } export interface IRequest extends IPage.IRequest { bomId?: string; componentItemId?: string; } }
