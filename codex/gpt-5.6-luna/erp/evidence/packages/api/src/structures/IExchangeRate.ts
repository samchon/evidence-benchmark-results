import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * ExchangeRate public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-exchange-rate-exchange-rates Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-exchange-rate-exchange-rates Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:exchange_rates Represents the persisted exchange_rates model.
 * @evidenceReview prisma:exchange_rates Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IExchangeRate extends IErpRecord {
  /** id.
   * @evidence prisma:exchange_rates.id Carries the persisted id value.
   * @evidenceReview prisma:exchange_rates.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:exchange_rates.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:exchange_rates.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:exchange_rates.name Carries the persisted name value.
   * @evidenceReview prisma:exchange_rates.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:exchange_rates.status Carries the persisted status value.
   * @evidenceReview prisma:exchange_rates.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:exchange_rates.description Carries the persisted description value.
   * @evidenceReview prisma:exchange_rates.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:exchange_rates.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:exchange_rates.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:exchange_rates.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:exchange_rates.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:exchange_rates.amount Carries the persisted amount value.
   * @evidenceReview prisma:exchange_rates.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:exchange_rates.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:exchange_rates.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:exchange_rates.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:exchange_rates.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:exchange_rates.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:exchange_rates.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:exchange_rates.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:exchange_rates.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
