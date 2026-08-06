import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:approval_requests Exposes the persisted approval_requests record.
 */
export interface IApprovalRequest {
  /** @evidence prisma:approval_requests.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:approval_requests.workflow_id Carries the persisted workflowId value. */
  workflowId: string & tags.Format<"uuid">;
  /** @evidence prisma:approval_requests.target_type Carries the persisted targetType value. */
  targetType: string;
  /** @evidence prisma:approval_requests.target_id Carries the persisted targetId value. */
  targetId: string;
  /** @evidence prisma:approval_requests.requester_user_id Carries the persisted requesterUserId value. */
  requesterUserId: string & tags.Format<"uuid">;
  /** @evidence prisma:approval_requests.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:approval_requests.current_step Carries the persisted currentStep value. */
  currentStep: number;
  /** @evidence prisma:approval_requests.delegated_user_id Carries the persisted delegatedUserId value. */
  delegatedUserId: (string & tags.Format<"uuid">) | null;
  /** @evidence prisma:approval_requests.escalated_at Carries the persisted escalatedAt value. */
  escalatedAt: (string & tags.Format<"date-time">) | null;
  /** @evidence prisma:approval_requests.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:approval_requests.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IApprovalRequest { export interface ICreate { workflowId: string & tags.Format<"uuid">; targetType: string; targetId: string; } export interface IRequest extends IPage.IRequest { status?: string; targetType?: string; } export interface IStatus { status: "approved" | "rejected" | "returned" | "cancelled"; } export interface IDelegate { userId: string & tags.Format<"uuid">; } }
