import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Timesheet public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-timesheet-timesheet-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-timesheet-timesheet-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:timesheets Represents the persisted timesheets model.
 * @evidenceReview prisma:timesheets Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ITimesheet extends IErpRecord {
  /** id.
   * @evidence prisma:timesheets.id Carries the persisted id value.
   * @evidenceReview prisma:timesheets.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:timesheets.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:timesheets.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:timesheets.name Carries the persisted name value.
   * @evidenceReview prisma:timesheets.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:timesheets.status Carries the persisted status value.
   * @evidenceReview prisma:timesheets.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:timesheets.description Carries the persisted description value.
   * @evidenceReview prisma:timesheets.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:timesheets.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:timesheets.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:timesheets.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:timesheets.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:timesheets.amount Carries the persisted amount value.
   * @evidenceReview prisma:timesheets.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:timesheets.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:timesheets.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:timesheets.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:timesheets.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:timesheets.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:timesheets.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:timesheets.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:timesheets.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
