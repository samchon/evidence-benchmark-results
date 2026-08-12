import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * MaintenancePlan public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-maintenance-plan-maintenance-plans Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-maintenance-plan-maintenance-plans Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:maintenance_plans Represents the persisted maintenance_plans model.
 * @evidenceReview prisma:maintenance_plans Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IMaintenancePlan extends IErpRecord {
  /** id.
   * @evidence prisma:maintenance_plans.id Carries the persisted id value.
   * @evidenceReview prisma:maintenance_plans.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:maintenance_plans.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:maintenance_plans.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:maintenance_plans.name Carries the persisted name value.
   * @evidenceReview prisma:maintenance_plans.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:maintenance_plans.status Carries the persisted status value.
   * @evidenceReview prisma:maintenance_plans.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:maintenance_plans.description Carries the persisted description value.
   * @evidenceReview prisma:maintenance_plans.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:maintenance_plans.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:maintenance_plans.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:maintenance_plans.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:maintenance_plans.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:maintenance_plans.amount Carries the persisted amount value.
   * @evidenceReview prisma:maintenance_plans.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:maintenance_plans.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:maintenance_plans.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:maintenance_plans.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:maintenance_plans.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:maintenance_plans.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:maintenance_plans.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:maintenance_plans.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:maintenance_plans.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
