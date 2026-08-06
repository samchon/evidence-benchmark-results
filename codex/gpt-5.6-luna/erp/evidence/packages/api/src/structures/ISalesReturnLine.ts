import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:sales_return_lines Exposes the persisted sales_return_lines record.
 */
export interface ISalesReturnLine {
  /** @evidence prisma:sales_return_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:sales_return_lines.sales_return_id Carries the persisted salesReturnId value. */
  salesReturnId: Id;
  /** @evidence prisma:sales_return_lines.sales_order_line_id Carries the persisted salesOrderLineId value. */
  salesOrderLineId: Id;
  /** @evidence prisma:sales_return_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:sales_return_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
  /** @evidence prisma:sales_return_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string&tags.Format<"date-time">;
} export namespace ISalesReturnLine { export interface ICreate { salesReturnId:Id; salesOrderLineId:Id; quantity:number; } export interface IRequest extends IPage.IRequest { salesReturnId?:Id; salesOrderLineId?:Id; } }
