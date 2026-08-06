import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:sales_quotes Exposes the persisted sales_quotes record.
 */
export interface ISalesQuote {
  /** @evidence prisma:sales_quotes.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:sales_quotes.customer_id Carries the persisted customerId value. */
  customerId: string & tags.Format<"uuid">;
/** @evidence prisma:sales_quotes.number Carries the persisted number value. */
  number: string;
/** @evidence prisma:sales_quotes.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:sales_quotes.quote_date Carries the persisted quoteDate value. */
  quoteDate: string & tags.Format<"date-time">;
/** @evidence prisma:sales_quotes.valid_until Carries the persisted validUntil value. */
  validUntil: null | (string & tags.Format<"date-time">);
/** @evidence prisma:sales_quotes.total_amount Carries the persisted totalAmount value. */
  totalAmount: number;
/** @evidence prisma:sales_quotes.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:sales_quotes.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ISalesQuote { export interface ICreate { customerId: string & tags.Format<"uuid">; validUntil?: null | (string & tags.Format<"date-time">); totalAmount: number; } export interface IRequest extends IPage.IRequest { customerId?: string; status?: string; } export interface IStatus { status: "sent" | "accepted" | "rejected" | "expired"; } }
