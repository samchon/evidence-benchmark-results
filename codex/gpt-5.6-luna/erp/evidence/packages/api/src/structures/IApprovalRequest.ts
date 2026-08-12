import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * ApprovalRequest public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-approval-request-approval-request-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-approval-request-approval-request-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:approval_requests Represents the persisted approval_requests model.
 * @evidenceReview prisma:approval_requests Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IApprovalRequest extends IErpRecord {
  /** id.
   * @evidence prisma:approval_requests.id Carries the persisted id value.
   * @evidenceReview prisma:approval_requests.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:approval_requests.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:approval_requests.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:approval_requests.name Carries the persisted name value.
   * @evidenceReview prisma:approval_requests.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:approval_requests.status Carries the persisted status value.
   * @evidenceReview prisma:approval_requests.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:approval_requests.description Carries the persisted description value.
   * @evidenceReview prisma:approval_requests.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:approval_requests.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:approval_requests.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:approval_requests.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:approval_requests.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:approval_requests.amount Carries the persisted amount value.
   * @evidenceReview prisma:approval_requests.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:approval_requests.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:approval_requests.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:approval_requests.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:approval_requests.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:approval_requests.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:approval_requests.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:approval_requests.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:approval_requests.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
