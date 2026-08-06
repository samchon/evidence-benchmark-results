import type { tags } from "typia"; import type { IPage } from "../typings"; type Id = string & tags.Format<"uuid">;
/**
 * @evidence prisma:vendor_payment_allocations Exposes the persisted vendor_payment_allocations record.
 */
export interface IVendorPaymentAllocation {
  /** @evidence prisma:vendor_payment_allocations.id Carries the persisted id value. */
  id: Id;
  /** @evidence prisma:vendor_payment_allocations.vendor_payment_id Carries the persisted vendorPaymentId value. */
  vendorPaymentId: Id;
  /** @evidence prisma:vendor_payment_allocations.vendor_bill_id Carries the persisted vendorBillId value. */
  vendorBillId: Id;
  /** @evidence prisma:vendor_payment_allocations.amount Carries the persisted amount value. */
  amount: number;
  /** @evidence prisma:vendor_payment_allocations.created_at Carries the persisted createdAt value. */
  createdAt: string&tags.Format<"date-time">;
} export namespace IVendorPaymentAllocation { export interface ICreate { vendorPaymentId:Id; vendorBillId:Id; amount:number; } export interface IRequest extends IPage.IRequest { vendorPaymentId?:Id; vendorBillId?:Id; } }
