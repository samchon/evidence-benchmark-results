import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:sales_quote_lines Exposes the persisted sales_quote_lines record.
 */
export interface ISalesQuoteLine {
  /** @evidence prisma:sales_quote_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:sales_quote_lines.sales_quote_id Carries the persisted salesQuoteId value. */
  salesQuoteId: Id;
  /** @evidence prisma:sales_quote_lines.item_id Carries the persisted itemId value. */
  itemId: null|Id;
  /** @evidence prisma:sales_quote_lines.description Carries the persisted description value. */
  description: string;
  /** @evidence prisma:sales_quote_lines.quantity Carries the persisted quantity value. */
  quantity: number;
  /** @evidence prisma:sales_quote_lines.unit_price Carries the persisted unitPrice value. */
  unitPrice: number;
  /** @evidence prisma:sales_quote_lines.currency_code Carries the persisted currencyCode value. */
  currencyCode: string;
  /** @evidence prisma:sales_quote_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
  /** @evidence prisma:sales_quote_lines.updated_at Carries the persisted updatedAt value. */
  updatedAt: string&tags.Format<"date-time">;
} export namespace ISalesQuoteLine { export interface ICreate { salesQuoteId:Id; itemId?:null|Id; description:string; quantity:number; unitPrice:number; currencyCode:string; } export interface IRequest extends IPage.IRequest { salesQuoteId?:Id; itemId?:Id; } }
