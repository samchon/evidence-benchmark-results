import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:sales_prices Exposes the persisted sales_prices record.
 */
export interface ISalesPrice {
  /** @evidence prisma:sales_prices.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:sales_prices.item_id Carries the persisted itemId value. */
  itemId: null | string;
/** @evidence prisma:sales_prices.customer_id Carries the persisted customerId value. */
  customerId: null | string;
/** @evidence prisma:sales_prices.currency_code Carries the persisted currencyCode value. */
  currencyCode: string;
/** @evidence prisma:sales_prices.unit_price Carries the persisted unitPrice value. */
  unitPrice: number;
/** @evidence prisma:sales_prices.valid_from Carries the persisted validFrom value. */
  validFrom: string & tags.Format<"date-time">;
/** @evidence prisma:sales_prices.valid_to Carries the persisted validTo value. */
  validTo: null | (string & tags.Format<"date-time">);
/** @evidence prisma:sales_prices.active Carries the persisted active value. */
  active: boolean;
/** @evidence prisma:sales_prices.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:sales_prices.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ISalesPrice { export interface ICreate { itemId?: null | string; customerId?: null | string; currencyCode: string; unitPrice: number; validFrom: string & tags.Format<"date-time">; validTo?: null | (string & tags.Format<"date-time">); } export interface IRequest extends IPage.IRequest { itemId?: string; customerId?: string; currencyCode?: string; asOf?: string & tags.Format<"date-time">; active?: boolean; } export interface IStatus { active: boolean; } }
