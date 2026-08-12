import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * PayrollConfiguration public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-payroll-config-payroll-configuration Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-payroll-config-payroll-configuration Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:payroll_configurations Represents the persisted payroll_configurations model.
 * @evidenceReview prisma:payroll_configurations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IPayrollConfiguration extends IErpRecord {
  /** id.
   * @evidence prisma:payroll_configurations.id Carries the persisted id value.
   * @evidenceReview prisma:payroll_configurations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:payroll_configurations.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:payroll_configurations.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:payroll_configurations.name Carries the persisted name value.
   * @evidenceReview prisma:payroll_configurations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:payroll_configurations.status Carries the persisted status value.
   * @evidenceReview prisma:payroll_configurations.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:payroll_configurations.description Carries the persisted description value.
   * @evidenceReview prisma:payroll_configurations.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:payroll_configurations.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:payroll_configurations.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:payroll_configurations.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:payroll_configurations.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:payroll_configurations.amount Carries the persisted amount value.
   * @evidenceReview prisma:payroll_configurations.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:payroll_configurations.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:payroll_configurations.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:payroll_configurations.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:payroll_configurations.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:payroll_configurations.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:payroll_configurations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:payroll_configurations.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:payroll_configurations.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
