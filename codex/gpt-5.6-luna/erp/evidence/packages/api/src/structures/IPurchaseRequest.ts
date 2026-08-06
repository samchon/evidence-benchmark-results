import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:purchase_requests Exposes the persisted purchase_requests record.
 */
export interface IPurchaseRequest {
  /** @evidence prisma:purchase_requests.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_requests.requester_id Carries the persisted requesterId value. */
  requesterId: string & tags.Format<"uuid">;
  /** @evidence prisma:purchase_requests.department_id Carries the persisted departmentId value. */
  departmentId: null | string;
  /** @evidence prisma:purchase_requests.project_id Carries the persisted projectId value. */
  projectId: null | string;
  /** @evidence prisma:purchase_requests.number Carries the persisted number value. */
  number: string;
  /** @evidence prisma:purchase_requests.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:purchase_requests.needed_by Carries the persisted neededBy value. */
  neededBy: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:purchase_requests.justification Carries the persisted justification value. */
  justification: string;
  /** @evidence prisma:purchase_requests.currency_code Carries the persisted currencyCode value. */
  currencyCode: string;
  /** @evidence prisma:purchase_requests.estimated_total Carries the persisted estimatedTotal value. */
  estimatedTotal: number;
  /** @evidence prisma:purchase_requests.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:purchase_requests.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
  lineIds: Array<string & tags.Format<"uuid">>;
}
export namespace IPurchaseRequest { export interface ICreate { departmentId?: null | string; projectId?: null | string; neededBy?: null | (string & tags.Format<"date-time">); justification: string; currencyCode: string; estimatedTotal: number; } export interface IRequest extends IPage.IRequest { status?: string; search?: string; } export interface IStatus { status: "draft" | "submitted" | "approved" | "rejected" | "returned" | "cancelled"; } }
