import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Warehouse public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-warehouse-warehouses Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-warehouse-warehouses Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:warehouses Represents the persisted warehouses model.
 * @evidenceReview prisma:warehouses Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IWarehouse extends IErpRecord {
  /** id.
   * @evidence prisma:warehouses.id Carries the persisted id value.
   * @evidenceReview prisma:warehouses.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:warehouses.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:warehouses.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:warehouses.name Carries the persisted name value.
   * @evidenceReview prisma:warehouses.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:warehouses.status Carries the persisted status value.
   * @evidenceReview prisma:warehouses.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:warehouses.description Carries the persisted description value.
   * @evidenceReview prisma:warehouses.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:warehouses.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:warehouses.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:warehouses.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:warehouses.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:warehouses.amount Carries the persisted amount value.
   * @evidenceReview prisma:warehouses.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:warehouses.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:warehouses.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:warehouses.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:warehouses.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:warehouses.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:warehouses.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:warehouses.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:warehouses.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
