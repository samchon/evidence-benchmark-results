import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * TaxRate public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-tax-code-tax-codes-and-rates Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-tax-code-tax-codes-and-rates Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:tax_rates Represents the persisted tax_rates model.
 * @evidenceReview prisma:tax_rates Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ITaxRate extends IErpRecord {
  /** id.
   * @evidence prisma:tax_rates.id Carries the persisted id value.
   * @evidenceReview prisma:tax_rates.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:tax_rates.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:tax_rates.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:tax_rates.name Carries the persisted name value.
   * @evidenceReview prisma:tax_rates.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:tax_rates.status Carries the persisted status value.
   * @evidenceReview prisma:tax_rates.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:tax_rates.description Carries the persisted description value.
   * @evidenceReview prisma:tax_rates.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:tax_rates.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:tax_rates.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:tax_rates.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:tax_rates.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:tax_rates.amount Carries the persisted amount value.
   * @evidenceReview prisma:tax_rates.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:tax_rates.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:tax_rates.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:tax_rates.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:tax_rates.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:tax_rates.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:tax_rates.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:tax_rates.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:tax_rates.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
