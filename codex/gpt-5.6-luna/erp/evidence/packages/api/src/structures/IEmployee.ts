import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Employee public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-employee-employee-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-employee-employee-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:employees Represents the persisted employees model.
 * @evidenceReview prisma:employees Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IEmployee extends IErpRecord {
  /** id.
   * @evidence prisma:employees.id Carries the persisted id value.
   * @evidenceReview prisma:employees.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:employees.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:employees.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:employees.name Carries the persisted name value.
   * @evidenceReview prisma:employees.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:employees.status Carries the persisted status value.
   * @evidenceReview prisma:employees.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:employees.description Carries the persisted description value.
   * @evidenceReview prisma:employees.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:employees.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:employees.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:employees.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:employees.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:employees.amount Carries the persisted amount value.
   * @evidenceReview prisma:employees.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:employees.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:employees.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:employees.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:employees.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:employees.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:employees.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:employees.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:employees.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
