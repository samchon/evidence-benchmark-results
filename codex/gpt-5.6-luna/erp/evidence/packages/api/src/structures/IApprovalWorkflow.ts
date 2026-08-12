import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * ApprovalWorkflow public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-approval-workflow-approval-workflow-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-approval-workflow-approval-workflow-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:approval_workflows Represents the persisted approval_workflows model.
 * @evidenceReview prisma:approval_workflows Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IApprovalWorkflow extends IErpRecord {
  /** id.
   * @evidence prisma:approval_workflows.id Carries the persisted id value.
   * @evidenceReview prisma:approval_workflows.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:approval_workflows.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:approval_workflows.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:approval_workflows.name Carries the persisted name value.
   * @evidenceReview prisma:approval_workflows.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:approval_workflows.status Carries the persisted status value.
   * @evidenceReview prisma:approval_workflows.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:approval_workflows.description Carries the persisted description value.
   * @evidenceReview prisma:approval_workflows.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:approval_workflows.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:approval_workflows.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:approval_workflows.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:approval_workflows.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:approval_workflows.amount Carries the persisted amount value.
   * @evidenceReview prisma:approval_workflows.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:approval_workflows.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:approval_workflows.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:approval_workflows.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:approval_workflows.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:approval_workflows.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:approval_workflows.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:approval_workflows.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:approval_workflows.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
