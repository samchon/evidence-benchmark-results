import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:vendor_credit_allocations Exposes the persisted vendor_credit_allocations record.
 */
export interface IVendorCreditAllocation {
  /** @evidence prisma:vendor_credit_allocations.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:vendor_credit_allocations.vendor_credit_id Carries the persisted vendorCreditId value. */
  vendorCreditId: Id;
  /** @evidence prisma:vendor_credit_allocations.vendor_bill_id Carries the persisted vendorBillId value. */
  vendorBillId: Id;
  /** @evidence prisma:vendor_credit_allocations.amount Carries the persisted amount value. */
  amount: number;
  /** @evidence prisma:vendor_credit_allocations.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
} export namespace IVendorCreditAllocation { export interface ICreate { vendorCreditId:Id; vendorBillId:Id; amount:number; } export interface IRequest extends IPage.IRequest { vendorCreditId?:Id; vendorBillId?:Id; } }
