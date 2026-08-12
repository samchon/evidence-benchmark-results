import { tags } from "typia";

import type { IErpRecord } from "./IErpRecord";

/**
 * AuditEvent public representation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-audit-event-audit-events Exposes the aggregate contract represented by this DTO.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-audit-event-audit-events Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:audit_events Represents the persisted audit_events model.
 * @evidenceReview prisma:audit_events Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IAuditEvent extends IErpRecord {
  /** id.
   * @evidence prisma:audit_events.id Carries the persisted id value.
   * @evidenceReview prisma:audit_events.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
   * @evidence prisma:audit_events.organization_id Carries the persisted organization_id value.
   * @evidenceReview prisma:audit_events.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:audit_events.name Carries the persisted name value.
   * @evidenceReview prisma:audit_events.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
   * @evidence prisma:audit_events.status Carries the persisted status value.
   * @evidenceReview prisma:audit_events.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
   * @evidence prisma:audit_events.description Carries the persisted description value.
   * @evidenceReview prisma:audit_events.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
   * @evidence prisma:audit_events.reference_id Carries the persisted reference_id value.
   * @evidenceReview prisma:audit_events.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | string & tags.Format<"uuid">;
  /** quantity.
   * @evidence prisma:audit_events.quantity Carries the persisted quantity value.
   * @evidenceReview prisma:audit_events.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
   * @evidence prisma:audit_events.amount Carries the persisted amount value.
   * @evidenceReview prisma:audit_events.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
   * @evidence prisma:audit_events.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:audit_events.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:audit_events.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:audit_events.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:audit_events.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:audit_events.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | string & tags.Format<"date-time">;
  /** attributes.
   * @evidence prisma:audit_events.attributes Carries aggregate-specific persisted fields.
   * @evidenceReview prisma:audit_events.attributes Read the DTO property and compared its type with the cited Prisma column.
   */
  attributes: null | Record<string, unknown>;
}
