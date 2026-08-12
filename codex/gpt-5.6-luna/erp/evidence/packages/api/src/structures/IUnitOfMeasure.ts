import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * UnitOfMeasure public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-uom-units-of-measure Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-uom-units-of-measure Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:units_of_measure Represents the persisted units_of_measure model.
 * @evidenceReview prisma:units_of_measure Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IUnitOfMeasure extends IErpRecord {
  /** id.
   * @evidence prisma:units_of_measure.id Carries the persisted id value.
   * @evidenceReview prisma:units_of_measure.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:units_of_measure.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:units_of_measure.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:units_of_measure.name Carries the persisted name value.
   * @evidenceReview prisma:units_of_measure.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:units_of_measure.status Carries the persisted status value.
   * @evidenceReview prisma:units_of_measure.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:units_of_measure.description Carries the persisted description value.
   * @evidenceReview prisma:units_of_measure.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:units_of_measure.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:units_of_measure.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:units_of_measure.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:units_of_measure.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:units_of_measure.amount Carries the persisted amount value.
   * @evidenceReview prisma:units_of_measure.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:units_of_measure.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:units_of_measure.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:units_of_measure.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:units_of_measure.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:units_of_measure.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:units_of_measure.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:units_of_measure.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:units_of_measure.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
