import type { tags } from "typia";

export interface IPaymentAllocation { id: string & tags.Format<"uuid">; paymentId: string & tags.Format<"uuid">; invoiceId: null | (string & tags.Format<"uuid">); billId: null | (string & tags.Format<"uuid">); amount: number; }
export namespace IPaymentAllocation { export interface ICreate { invoiceId?: null | (string & tags.Format<"uuid">); billId?: null | (string & tags.Format<"uuid">); amount: number & tags.Minimum<0>; } export interface IUpdate { amount: number & tags.Minimum<0>; } }
