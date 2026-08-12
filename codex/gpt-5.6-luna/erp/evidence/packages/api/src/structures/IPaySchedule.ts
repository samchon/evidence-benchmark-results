import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * PaySchedule public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-pay-schedule-pay-schedules Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-pay-schedule-pay-schedules Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:pay_schedules Represents the persisted pay_schedules model.
 * @evidenceReview prisma:pay_schedules Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IPaySchedule extends IErpRecord {
  /** id.
   * @evidence prisma:pay_schedules.id Carries the persisted id value.
   * @evidenceReview prisma:pay_schedules.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:pay_schedules.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:pay_schedules.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:pay_schedules.name Carries the persisted name value.
   * @evidenceReview prisma:pay_schedules.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:pay_schedules.status Carries the persisted status value.
   * @evidenceReview prisma:pay_schedules.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:pay_schedules.description Carries the persisted description value.
   * @evidenceReview prisma:pay_schedules.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:pay_schedules.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:pay_schedules.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:pay_schedules.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:pay_schedules.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:pay_schedules.amount Carries the persisted amount value.
   * @evidenceReview prisma:pay_schedules.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:pay_schedules.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:pay_schedules.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:pay_schedules.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:pay_schedules.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:pay_schedules.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:pay_schedules.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:pay_schedules.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:pay_schedules.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
