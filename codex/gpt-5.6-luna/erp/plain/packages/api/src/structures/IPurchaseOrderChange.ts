import type { tags } from "typia";

export interface IPurchaseOrderChange { id: string & tags.Format<"uuid">; orderId: string & tags.Format<"uuid">; reason: string; status: "pending" | "approved" | "rejected" | "applied"; beforeLines: IPurchaseOrderChange.ILine[]; afterLines: IPurchaseOrderChange.ILine[]; approvalId: string & tags.Format<"uuid">; appliedAt: null | (string & tags.Format<"date-time">); }
export namespace IPurchaseOrderChange { export interface ILine { itemId: string & tags.Format<"uuid">; orderedQuantity: number & tags.Minimum<0>; unitPrice: number & tags.Minimum<0>; unitId: string & tags.Format<"uuid">; warehouseId?: null | (string & tags.Format<"uuid">); } export interface IRequest { reason: string; lines: ILine[]; } }
