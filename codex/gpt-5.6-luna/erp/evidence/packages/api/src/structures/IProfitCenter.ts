import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * ProfitCenter public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profit-center-profit-centers Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profit-center-profit-centers Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:profit_centers Represents the persisted profit_centers model.
 * @evidenceReview prisma:profit_centers Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IProfitCenter extends IErpRecord {
  /** id.
   * @evidence prisma:profit_centers.id Carries the persisted id value.
   * @evidenceReview prisma:profit_centers.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:profit_centers.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:profit_centers.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:profit_centers.name Carries the persisted name value.
   * @evidenceReview prisma:profit_centers.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:profit_centers.status Carries the persisted status value.
   * @evidenceReview prisma:profit_centers.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:profit_centers.description Carries the persisted description value.
   * @evidenceReview prisma:profit_centers.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:profit_centers.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:profit_centers.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:profit_centers.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:profit_centers.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:profit_centers.amount Carries the persisted amount value.
   * @evidenceReview prisma:profit_centers.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:profit_centers.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:profit_centers.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:profit_centers.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:profit_centers.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:profit_centers.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:profit_centers.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:profit_centers.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:profit_centers.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
