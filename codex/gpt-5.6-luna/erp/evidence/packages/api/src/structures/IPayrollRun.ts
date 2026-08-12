import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * PayrollRun public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-payroll-run-payroll-run-lifecycle Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-payroll-run-payroll-run-lifecycle Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:payroll_runs Represents the persisted payroll_runs model.
 * @evidenceReview prisma:payroll_runs Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IPayrollRun extends IErpRecord {
  /** id.
   * @evidence prisma:payroll_runs.id Carries the persisted id value.
   * @evidenceReview prisma:payroll_runs.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:payroll_runs.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:payroll_runs.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:payroll_runs.name Carries the persisted name value.
   * @evidenceReview prisma:payroll_runs.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:payroll_runs.status Carries the persisted status value.
   * @evidenceReview prisma:payroll_runs.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:payroll_runs.description Carries the persisted description value.
   * @evidenceReview prisma:payroll_runs.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:payroll_runs.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:payroll_runs.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:payroll_runs.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:payroll_runs.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:payroll_runs.amount Carries the persisted amount value.
   * @evidenceReview prisma:payroll_runs.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:payroll_runs.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:payroll_runs.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:payroll_runs.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:payroll_runs.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:payroll_runs.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:payroll_runs.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:payroll_runs.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:payroll_runs.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
