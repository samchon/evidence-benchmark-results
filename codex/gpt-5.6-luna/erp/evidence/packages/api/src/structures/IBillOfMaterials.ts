import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * BillOfMaterials public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-bom-bill-of-materials-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-bom-bill-of-materials-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:bill_of_materials Represents the persisted bill_of_materials model.
 * @evidenceReview prisma:bill_of_materials Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IBillOfMaterials extends IErpRecord {
  /** id.
   * @evidence prisma:bill_of_materials.id Carries the persisted id value.
   * @evidenceReview prisma:bill_of_materials.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:bill_of_materials.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:bill_of_materials.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:bill_of_materials.name Carries the persisted name value.
   * @evidenceReview prisma:bill_of_materials.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:bill_of_materials.status Carries the persisted status value.
   * @evidenceReview prisma:bill_of_materials.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:bill_of_materials.description Carries the persisted description value.
   * @evidenceReview prisma:bill_of_materials.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:bill_of_materials.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:bill_of_materials.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:bill_of_materials.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:bill_of_materials.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:bill_of_materials.amount Carries the persisted amount value.
   * @evidenceReview prisma:bill_of_materials.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:bill_of_materials.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:bill_of_materials.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:bill_of_materials.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:bill_of_materials.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:bill_of_materials.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:bill_of_materials.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:bill_of_materials.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:bill_of_materials.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
