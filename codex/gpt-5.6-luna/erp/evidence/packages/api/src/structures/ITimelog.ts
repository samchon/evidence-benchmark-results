import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Timelog public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-timelog-timelogs Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-timelog-timelogs Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:timelogs Represents the persisted timelogs model.
 * @evidenceReview prisma:timelogs Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ITimelog extends IErpRecord {
  /** id.
   * @evidence prisma:timelogs.id Carries the persisted id value.
   * @evidenceReview prisma:timelogs.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:timelogs.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:timelogs.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:timelogs.name Carries the persisted name value.
   * @evidenceReview prisma:timelogs.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:timelogs.status Carries the persisted status value.
   * @evidenceReview prisma:timelogs.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:timelogs.description Carries the persisted description value.
   * @evidenceReview prisma:timelogs.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:timelogs.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:timelogs.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:timelogs.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:timelogs.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:timelogs.amount Carries the persisted amount value.
   * @evidenceReview prisma:timelogs.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:timelogs.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:timelogs.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:timelogs.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:timelogs.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:timelogs.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:timelogs.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:timelogs.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:timelogs.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
