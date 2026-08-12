import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Currency public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-currency-currencies Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-currency-currencies Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:currencies Represents the persisted currencies model.
 * @evidenceReview prisma:currencies Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ICurrency extends IErpRecord {
  /** id.
   * @evidence prisma:currencies.id Carries the persisted id value.
   * @evidenceReview prisma:currencies.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:currencies.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:currencies.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:currencies.name Carries the persisted name value.
   * @evidenceReview prisma:currencies.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:currencies.status Carries the persisted status value.
   * @evidenceReview prisma:currencies.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:currencies.description Carries the persisted description value.
   * @evidenceReview prisma:currencies.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:currencies.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:currencies.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:currencies.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:currencies.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:currencies.amount Carries the persisted amount value.
   * @evidenceReview prisma:currencies.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:currencies.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:currencies.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:currencies.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:currencies.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:currencies.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:currencies.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:currencies.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:currencies.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
