import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:service_orders Exposes the persisted service_orders record.
 */
export interface IServiceOrder {
  /** @evidence prisma:service_orders.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:service_orders.service_case_id Carries the persisted serviceCaseId value. */
  serviceCaseId: null | string;
  /** @evidence prisma:service_orders.customer_id Carries the persisted customerId value. */
  customerId: null | string;
  /** @evidence prisma:service_orders.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:service_orders.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:service_orders.scheduled_at Carries the persisted scheduledAt value. */
  scheduledAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:service_orders.completed_at Carries the persisted completedAt value. */
  completedAt: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:service_orders.total_amount Carries the persisted totalAmount value. */
  totalAmount: number;
  /** @evidence prisma:service_orders.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:service_orders.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IServiceOrder { export interface ICreate { serviceCaseId?: null | string; customerId?: null | string; scheduledAt?: null | (string & tags.Format<"date-time">); totalAmount: number; } export interface IRequest extends IPage.IRequest { customerId?: string; status?: string; } export interface IStatus { status: "draft" | "scheduled" | "in_progress" | "completed" | "cancelled"; } }
