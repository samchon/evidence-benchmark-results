import type { tags } from "typia";

export interface IBankTransaction { id: string & tags.Format<"uuid">; bankAccountId: string & tags.Format<"uuid">; statementDate: string & tags.Format<"date-time">; amount: number; currency: string; reference: null | string; status: "imported" | "matched" | "ignored" | "reconciled"; matchedTargetType: null | string; matchedTargetId: null | (string & tags.Format<"uuid">); }
export namespace IBankTransaction {
  export interface ICreate { bankAccountId: string & tags.Format<"uuid">; statementDate: string & tags.Format<"date-time">; amount: number; currency: string; reference?: null | string; }
  export interface IImport { bankAccountId: string & tags.Format<"uuid">; transactions: ICreate[]; }
  export interface IIndex { page?: number; limit?: number; bankAccountId?: string & tags.Format<"uuid">; status?: IBankTransaction["status"]; }
  export interface IMatch { targetType: "payment" | "journal" | "payroll" | "transfer" | "adjustment"; targetId: string & tags.Format<"uuid">; }
}

export interface IReconciliation { id: string & tags.Format<"uuid">; bankAccountId: string & tags.Format<"uuid">; startsAt: string & tags.Format<"date-time">; endsAt: string & tags.Format<"date-time">; beginningBalance: number; endingBalance: number; status: "draft" | "in_progress" | "completed" | "reopened"; completedAt: null | (string & tags.Format<"date-time">); lines: IReconciliation.ILine[]; }
export namespace IReconciliation {
  export interface ILine { id: string & tags.Format<"uuid">; bankTransactionId: string & tags.Format<"uuid">; resolved: boolean; }
  export interface ICreate { bankAccountId: string & tags.Format<"uuid">; startsAt: string & tags.Format<"date-time">; endsAt: string & tags.Format<"date-time">; beginningBalance: number; endingBalance: number; }
  export interface ILineCreate { bankTransactionId: string & tags.Format<"uuid">; resolved?: boolean; }
  export interface IReopenRequest { reason: string; }
}
