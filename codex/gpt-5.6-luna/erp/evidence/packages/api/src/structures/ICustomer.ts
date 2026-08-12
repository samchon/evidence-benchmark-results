import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Customer public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-customer-customer-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-customer-customer-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:customers Represents the persisted customers model.
 * @evidenceReview prisma:customers Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface ICustomer extends IErpRecord {
  /** id.
   * @evidence prisma:customers.id Carries the persisted id value.
   * @evidenceReview prisma:customers.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:customers.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:customers.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:customers.name Carries the persisted name value.
   * @evidenceReview prisma:customers.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:customers.status Carries the persisted status value.
   * @evidenceReview prisma:customers.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:customers.description Carries the persisted description value.
   * @evidenceReview prisma:customers.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:customers.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:customers.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:customers.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:customers.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:customers.amount Carries the persisted amount value.
   * @evidenceReview prisma:customers.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:customers.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:customers.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:customers.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:customers.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:customers.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:customers.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:customers.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:customers.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
