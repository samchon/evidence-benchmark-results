import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Machine public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-machine-machines Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-machine-machines Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:machines Represents the persisted machines model.
 * @evidenceReview prisma:machines Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IMachine extends IErpRecord {
  /** id.
   * @evidence prisma:machines.id Carries the persisted id value.
   * @evidenceReview prisma:machines.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:machines.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:machines.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:machines.name Carries the persisted name value.
   * @evidenceReview prisma:machines.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:machines.status Carries the persisted status value.
   * @evidenceReview prisma:machines.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:machines.description Carries the persisted description value.
   * @evidenceReview prisma:machines.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:machines.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:machines.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:machines.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:machines.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:machines.amount Carries the persisted amount value.
   * @evidenceReview prisma:machines.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:machines.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:machines.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:machines.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:machines.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:machines.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:machines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:machines.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:machines.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
