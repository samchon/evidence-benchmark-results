import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:payroll_configurations Exposes the persisted payroll_configurations record.
 */
export interface IPayrollConfiguration {
  /** @evidence prisma:payroll_configurations.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:payroll_configurations.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:payroll_configurations.currency_code Carries the persisted currencyCode value. */
  currencyCode: string;
  /** @evidence prisma:payroll_configurations.pay_frequency Carries the persisted payFrequency value. */
  payFrequency: string;
  /** @evidence prisma:payroll_configurations.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:payroll_configurations.effective_from Carries the persisted effectiveFrom value. */
  effectiveFrom: string & tags.Format<"date-time">;
  /** @evidence prisma:payroll_configurations.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:payroll_configurations.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPayrollConfiguration { export interface ICreate { name: string; currencyCode: string; payFrequency: string; effectiveFrom: string & tags.Format<"date-time">; } export interface IRequest extends IPage.IRequest { status?: string; } export interface IStatus { status: "draft" | "active" | "inactive"; } }
