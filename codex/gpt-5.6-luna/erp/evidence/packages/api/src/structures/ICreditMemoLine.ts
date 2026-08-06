import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:credit_memo_lines Exposes the persisted credit_memo_lines record.
 */
export interface ICreditMemoLine {
  /** @evidence prisma:credit_memo_lines.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:credit_memo_lines.credit_memo_id Carries the persisted creditMemoId value. */
  creditMemoId: Id;
  /** @evidence prisma:credit_memo_lines.sales_invoice_id Carries the persisted salesInvoiceId value. */
  salesInvoiceId: null|Id;
  /** @evidence prisma:credit_memo_lines.amount Carries the persisted amount value. */
  amount: number;
  /** @evidence prisma:credit_memo_lines.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
} export namespace ICreditMemoLine { export interface ICreate { creditMemoId:Id; salesInvoiceId?:null|Id; amount:number; } export interface IRequest extends IPage.IRequest { creditMemoId?:Id; salesInvoiceId?:Id; } }
