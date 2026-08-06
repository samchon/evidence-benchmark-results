import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:employment_contracts Exposes the persisted employment_contracts record.
 */
export interface IEmploymentContract {
  /** @evidence prisma:employment_contracts.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:employment_contracts.employee_id Carries the persisted employeeId value. */
  employeeId: string & tags.Format<"uuid">;
  /** @evidence prisma:employment_contracts.contract_type Carries the persisted contractType value. */
  contractType: string;
  /** @evidence prisma:employment_contracts.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:employment_contracts.starts_at Carries the persisted startsAt value. */
  startsAt: string & tags.Format<"date-time">;
  /** @evidence prisma:employment_contracts.ends_at Carries the persisted endsAt value. */
  endsAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:employment_contracts.salary Carries the persisted salary value. */
  salary: null | number;
  /** @evidence prisma:employment_contracts.currency_code Carries the persisted currencyCode value. */
  currencyCode: null | string;
  /** @evidence prisma:employment_contracts.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:employment_contracts.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IEmploymentContract { export interface ICreate { employeeId: string & tags.Format<"uuid">; contractType: string; startsAt: string & tags.Format<"date-time">; endsAt?: null | (string & tags.Format<"date-time">); salary?: null | number; currencyCode?: null | string; } export interface IRequest extends IPage.IRequest { employeeId?: string; status?: string; } export interface IStatus { status: "draft" | "active" | "ended" | "cancelled"; } }
