import type { tags } from "typia";
import type { IPage } from "../typings";
/** Organization document-number sequence. */
/**
 * @evidence prisma:document_number_sequences Exposes the persisted document_number_sequences record.
 */
export interface IDocumentNumber {
  /** @evidence prisma:document_number_sequences.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:document_number_sequences.document_type Carries the persisted documentType value. */
  documentType: string;
  /** @evidence prisma:document_number_sequences.prefix Carries the persisted prefix value. */
  prefix: string;
  /** @evidence prisma:document_number_sequences.next_number Carries the persisted nextNumber value. */
  nextNumber: number;
  /** @evidence prisma:document_number_sequences.active Carries the persisted active value. */
  active: boolean;
  /** @evidence prisma:document_number_sequences.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:document_number_sequences.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IDocumentNumber { export interface ICreate { documentType: string & tags.MinLength<1>; prefix: string; nextNumber?: number & tags.Type<"uint32">; } export interface IUpdate { prefix?: string; active?: boolean; } export interface IRequest extends IPage.IRequest { documentType?: string; includeInactive?: boolean; } export interface IIssue { documentType: string & tags.MinLength<1>; } export interface IIssued { documentType: string; number: number; rendered: string; } }
