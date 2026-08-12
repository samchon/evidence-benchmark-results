import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * TaxJurisdiction public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-tax-jurisdiction-tax-jurisdictions Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-tax-jurisdiction-tax-jurisdictions Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:tax_jurisdictions Represents the persisted tax_jurisdictions model.
 * @evidenceReview prisma:tax_jurisdictions Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ITaxJurisdiction extends IErpRecord {
  /** id.
   * @evidence prisma:tax_jurisdictions.id Carries the persisted id value.
   * @evidenceReview prisma:tax_jurisdictions.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:tax_jurisdictions.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:tax_jurisdictions.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:tax_jurisdictions.name Carries the persisted name value.
   * @evidenceReview prisma:tax_jurisdictions.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:tax_jurisdictions.status Carries the persisted status value.
   * @evidenceReview prisma:tax_jurisdictions.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:tax_jurisdictions.description Carries the persisted description value.
   * @evidenceReview prisma:tax_jurisdictions.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:tax_jurisdictions.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:tax_jurisdictions.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:tax_jurisdictions.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:tax_jurisdictions.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:tax_jurisdictions.amount Carries the persisted amount value.
   * @evidenceReview prisma:tax_jurisdictions.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:tax_jurisdictions.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:tax_jurisdictions.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:tax_jurisdictions.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:tax_jurisdictions.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:tax_jurisdictions.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:tax_jurisdictions.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:tax_jurisdictions.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:tax_jurisdictions.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
