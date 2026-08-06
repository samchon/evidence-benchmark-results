import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:service_cases Exposes the persisted service_cases record.
 */
export interface IServiceCase {
  /** @evidence prisma:service_cases.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:service_cases.customer_id Carries the persisted customerId value. */
  customerId: null | string;
/** @evidence prisma:service_cases.number Carries the persisted number value. */
  number: string;
/** @evidence prisma:service_cases.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:service_cases.priority Carries the persisted priority value. */
  priority: string;
/** @evidence prisma:service_cases.subject Carries the persisted subject value. */
  subject: string;
/** @evidence prisma:service_cases.description Carries the persisted description value. */
  description: null | string;
/** @evidence prisma:service_cases.assigned_employee_id Carries the persisted assignedEmployeeId value. */
  assignedEmployeeId: null | string;
/** @evidence prisma:service_cases.opened_at Carries the persisted openedAt value. */
  openedAt: string & tags.Format<"date-time">;
/** @evidence prisma:service_cases.closed_at Carries the persisted closedAt value. */
  closedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:service_cases.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:service_cases.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IServiceCase { export interface ICreate { customerId?: null | string; priority: string; subject: string; description?: null | string; assignedEmployeeId?: null | string; } export interface IRequest extends IPage.IRequest { customerId?: string; status?: string; } export interface IStatus { status: "open" | "in_progress" | "resolved" | "closed" | "cancelled"; } }
