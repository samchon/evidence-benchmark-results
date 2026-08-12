import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * ServiceCase public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-service-case-service-case-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-service-case-service-case-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:service_cases Represents the persisted service_cases model.
 * @evidenceReview prisma:service_cases Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IServiceCase extends IErpRecord {
  /** id.
   * @evidence prisma:service_cases.id Carries the persisted id value.
   * @evidenceReview prisma:service_cases.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:service_cases.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:service_cases.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:service_cases.name Carries the persisted name value.
   * @evidenceReview prisma:service_cases.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:service_cases.status Carries the persisted status value.
   * @evidenceReview prisma:service_cases.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:service_cases.description Carries the persisted description value.
   * @evidenceReview prisma:service_cases.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:service_cases.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:service_cases.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:service_cases.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:service_cases.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:service_cases.amount Carries the persisted amount value.
   * @evidenceReview prisma:service_cases.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:service_cases.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:service_cases.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:service_cases.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:service_cases.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:service_cases.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:service_cases.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:service_cases.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:service_cases.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
