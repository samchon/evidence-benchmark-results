import type { tags } from "typia"; import type { IPage } from "../typings";
/** Vendor bill lifecycle and retained dispute correction reasons.
 */
/**
 * @evidence prisma:vendor_bills Exposes the persisted vendor_bills record.
 */
export interface IVendorBill {
  /** @evidence prisma:vendor_bills.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:vendor_bills.vendor_id Carries the persisted vendorId value. */
  vendorId: string & tags.Format<"uuid">;
/** @evidence prisma:vendor_bills.purchase_order_id Carries the persisted purchaseOrderId value. */
  purchaseOrderId: null | string;
/** @evidence prisma:vendor_bills.number Carries the persisted number value. */
  number: string;
/** @evidence prisma:vendor_bills.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:vendor_bills.bill_date Carries the persisted billDate value. */
  billDate: string & tags.Format<"date-time">;
/** @evidence prisma:vendor_bills.due_date Carries the persisted dueDate value. */
  dueDate: null | (string & tags.Format<"date-time">);
/** @evidence prisma:vendor_bills.total_amount Carries the persisted totalAmount value. */
  totalAmount: number;
/** @evidence prisma:vendor_bills.paid_amount Carries the persisted paidAmount value. */
  paidAmount: number;
/** @evidence prisma:vendor_bills.dispute_reason Carries the persisted disputeReason value. */
  disputeReason: string | null;
/** @evidence prisma:vendor_bills.resolution_reason Carries the persisted resolutionReason value. */
  resolutionReason: string | null;
/** @evidence prisma:vendor_bills.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:vendor_bills.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IVendorBill { export interface ICreate { vendorId: string & tags.Format<"uuid">; purchaseOrderId?: null | string; billDate: string & tags.Format<"date-time">; dueDate?: null | (string & tags.Format<"date-time">); totalAmount: number; } export interface IRequest extends IPage.IRequest { vendorId?: string; status?: string; } export interface IStatus { status: "draft" | "approved" | "posted" | "partly_paid" | "paid" | "disputed" | "void"; reason?: string; } }
