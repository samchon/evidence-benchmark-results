import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * WorkCenter public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-work-center-work-centers Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-work-center-work-centers Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:work_centers Represents the persisted work_centers model.
 * @evidenceReview prisma:work_centers Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IWorkCenter extends IErpRecord {
  /** id.
   * @evidence prisma:work_centers.id Carries the persisted id value.
   * @evidenceReview prisma:work_centers.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:work_centers.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:work_centers.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:work_centers.name Carries the persisted name value.
   * @evidenceReview prisma:work_centers.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:work_centers.status Carries the persisted status value.
   * @evidenceReview prisma:work_centers.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:work_centers.description Carries the persisted description value.
   * @evidenceReview prisma:work_centers.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:work_centers.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:work_centers.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:work_centers.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:work_centers.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:work_centers.amount Carries the persisted amount value.
   * @evidenceReview prisma:work_centers.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:work_centers.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:work_centers.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:work_centers.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:work_centers.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:work_centers.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:work_centers.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:work_centers.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:work_centers.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
