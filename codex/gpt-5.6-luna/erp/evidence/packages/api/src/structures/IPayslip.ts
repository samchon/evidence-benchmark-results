import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:payslips Exposes the persisted payslips record.
 */
export interface IPayslip {
  /** @evidence prisma:payslips.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:payslips.payroll_run_id Carries the persisted payrollRunId value. */
  payrollRunId: string & tags.Format<"uuid">;
/** @evidence prisma:payslips.employee_id Carries the persisted employeeId value. */
  employeeId: string & tags.Format<"uuid">;
  /** @evidence prisma:payslips.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:payslips.gross_amount Carries the persisted grossAmount value. */
  grossAmount: number;
/** @evidence prisma:payslips.tax_amount Carries the persisted taxAmount value. */
  taxAmount: number;
/** @evidence prisma:payslips.net_amount Carries the persisted netAmount value. */
  netAmount: number;
/** @evidence prisma:payslips.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:payslips.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPayslip { export interface ICreate { payrollRunId: string & tags.Format<"uuid">; employeeId: string & tags.Format<"uuid">; grossAmount: number; taxAmount: number; netAmount: number; } export interface IRequest extends IPage.IRequest { payrollRunId?: string; employeeId?: string; status?: string; } export interface IStatus { status: "draft" | "issued" | "paid" | "void"; } }
