import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * Payslip public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-payslip-payslips Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-payslip-payslips Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:payslips Represents the persisted payslips model.
 * @evidenceReview prisma:payslips Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IPayslip extends IErpRecord {
  /** id.
   * @evidence prisma:payslips.id Carries the persisted id value.
   * @evidenceReview prisma:payslips.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:payslips.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:payslips.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:payslips.name Carries the persisted name value.
   * @evidenceReview prisma:payslips.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:payslips.status Carries the persisted status value.
   * @evidenceReview prisma:payslips.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:payslips.description Carries the persisted description value.
   * @evidenceReview prisma:payslips.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:payslips.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:payslips.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:payslips.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:payslips.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:payslips.amount Carries the persisted amount value.
   * @evidenceReview prisma:payslips.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:payslips.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:payslips.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:payslips.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:payslips.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:payslips.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:payslips.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:payslips.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:payslips.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
