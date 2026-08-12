import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Task public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-task-task-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-task-task-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:tasks Represents the persisted tasks model.
 * @evidenceReview prisma:tasks Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ITask extends IErpRecord {
  /** id.
   * @evidence prisma:tasks.id Carries the persisted id value.
   * @evidenceReview prisma:tasks.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:tasks.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:tasks.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:tasks.name Carries the persisted name value.
   * @evidenceReview prisma:tasks.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:tasks.status Carries the persisted status value.
   * @evidenceReview prisma:tasks.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:tasks.description Carries the persisted description value.
   * @evidenceReview prisma:tasks.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:tasks.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:tasks.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:tasks.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:tasks.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:tasks.amount Carries the persisted amount value.
   * @evidenceReview prisma:tasks.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:tasks.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:tasks.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:tasks.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:tasks.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:tasks.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:tasks.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:tasks.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:tasks.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
