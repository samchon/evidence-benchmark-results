import type { tags } from "typia";
import type { IPage } from "../typings";
/** Organization employee record. */
/**
 * @evidence prisma:employees Exposes the persisted employees record.
 */
export interface IEmployee {
  /** @evidence prisma:employees.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:employees.employee_number Carries the persisted employeeNumber value. */
  employeeNumber: string;
/** @evidence prisma:employees.user_id Carries the persisted userId value. */
  userId: null | string;
/** @evidence prisma:employees.first_name Carries the persisted firstName value. */
  firstName: string;
/** @evidence prisma:employees.last_name Carries the persisted lastName value. */
  lastName: string;
  /** @evidence prisma:employees.email Carries the persisted email value. */
  email: null | string;
  /** @evidence prisma:employees.phone Carries the persisted phone value. */
  phone: null | string;
/** @evidence prisma:employees.department_id Carries the persisted departmentId value. */
  departmentId: null | string;
/** @evidence prisma:employees.hire_date Carries the persisted hireDate value. */
  hireDate: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:employees.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:employees.active Carries the persisted active value. */
  active: boolean;
/** @evidence prisma:employees.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:employees.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IEmployee { export interface ICreate { employeeNumber: string & tags.MinLength<1>; userId?: null | string; firstName: string & tags.MinLength<1>; lastName: string & tags.MinLength<1>; email?: null | string; phone?: null | string; departmentId?: null | string; hireDate?: null | (string & tags.Format<"date-time">); status?: string; } export interface IUpdate { firstName?: string; lastName?: string; email?: null | string; phone?: null | string; departmentId?: null | string; hireDate?: null | string; status?: string; } export interface IRequest extends IPage.IRequest { search?: string; departmentId?: string; includeInactive?: boolean; } }
