import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * FiscalPeriod public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-fiscal-period-fiscal-period-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-fiscal-period-fiscal-period-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:fiscal_periods Represents the persisted fiscal_periods model.
 * @evidenceReview prisma:fiscal_periods Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IFiscalPeriod extends IErpRecord {
  /** id.
   * @evidence prisma:fiscal_periods.id Carries the persisted id value.
   * @evidenceReview prisma:fiscal_periods.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:fiscal_periods.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:fiscal_periods.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:fiscal_periods.name Carries the persisted name value.
   * @evidenceReview prisma:fiscal_periods.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:fiscal_periods.status Carries the persisted status value.
   * @evidenceReview prisma:fiscal_periods.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:fiscal_periods.description Carries the persisted description value.
   * @evidenceReview prisma:fiscal_periods.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:fiscal_periods.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:fiscal_periods.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:fiscal_periods.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:fiscal_periods.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:fiscal_periods.amount Carries the persisted amount value.
   * @evidenceReview prisma:fiscal_periods.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:fiscal_periods.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:fiscal_periods.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:fiscal_periods.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:fiscal_periods.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:fiscal_periods.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:fiscal_periods.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:fiscal_periods.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:fiscal_periods.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
