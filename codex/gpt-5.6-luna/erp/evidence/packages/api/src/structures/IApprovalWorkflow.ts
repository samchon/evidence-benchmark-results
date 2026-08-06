import type { tags } from "typia"; import type { IPage } from "../typings";
/** Versioned approval workflow definition.
 */
/**
 * @evidence prisma:approval_workflows Exposes the persisted approval_workflows record.
 */
export interface IApprovalWorkflow {
  /** @evidence prisma:approval_workflows.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:approval_workflows.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:approval_workflows.target_type Carries the persisted targetType value. */
  targetType: string;
  /** @evidence prisma:approval_workflows.status Carries the persisted status value. */
  status: string;
  /** @evidence prisma:approval_workflows.steps Carries the persisted steps value. */
  steps: string;
  /** @evidence prisma:approval_workflows.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:approval_workflows.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IApprovalWorkflow { export interface ICreate { name: string; targetType: string; steps: string; } export interface IRequest extends IPage.IRequest { targetType?: string; status?: string; } export interface IStatus { status: "draft" | "active" | "inactive"; } export interface IVersion { steps: string; } }
