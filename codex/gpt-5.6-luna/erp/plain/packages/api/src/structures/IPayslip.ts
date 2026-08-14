import type { tags } from "typia";

export interface IPayslip { id: string & tags.Format<"uuid">; payrollRunId: string & tags.Format<"uuid">; employeeId: string & tags.Format<"uuid">; gross: number; deductions: number; net: number; status: "draft" | "published"; publishedAt: null | (string & tags.Format<"date-time">); }
export namespace IPayslip { export interface IIndex { page?: number; limit?: number; employeeId?: string & tags.Format<"uuid">; } }
