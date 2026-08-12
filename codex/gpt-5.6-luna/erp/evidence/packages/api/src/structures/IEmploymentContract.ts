import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * EmploymentContract public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-contract-employment-contract-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-contract-employment-contract-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:employment_contracts Represents the persisted employment_contracts model.
 * @evidenceReview prisma:employment_contracts Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IEmploymentContract extends IErpRecord {
  /** id.
   * @evidence prisma:employment_contracts.id Carries the persisted id value.
   * @evidenceReview prisma:employment_contracts.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:employment_contracts.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:employment_contracts.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:employment_contracts.name Carries the persisted name value.
   * @evidenceReview prisma:employment_contracts.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:employment_contracts.status Carries the persisted status value.
   * @evidenceReview prisma:employment_contracts.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:employment_contracts.description Carries the persisted description value.
   * @evidenceReview prisma:employment_contracts.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:employment_contracts.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:employment_contracts.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:employment_contracts.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:employment_contracts.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:employment_contracts.amount Carries the persisted amount value.
   * @evidenceReview prisma:employment_contracts.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:employment_contracts.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:employment_contracts.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:employment_contracts.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:employment_contracts.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:employment_contracts.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:employment_contracts.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:employment_contracts.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:employment_contracts.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
