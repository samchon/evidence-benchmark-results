import type { tags } from "typia";
import type { IPage } from "../typings";

/** Journal entry with balanced debit and credit lines.
 * @evidence prisma:journal_entries Exposes the persisted journal_entries record.
 */
export interface IJournal {
/** @evidence prisma:journal_entries.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:journal_entries.source_module Carries the persisted sourceModule value. */
  sourceModule: string;
/** @evidence prisma:journal_entries.source_document_id Carries the persisted sourceDocumentId value. */
  sourceDocumentId: null | string;
/** @evidence prisma:journal_entries.memo Carries the persisted memo value. */
  memo: null | string;
/** @evidence prisma:journal_entries.entry_date Carries the persisted entryDate value. */
  entryDate: string & tags.Format<"date-time">;
/** @evidence prisma:journal_entries.currency_code Carries the persisted currencyCode value. */
  currencyCode: string;
/** @evidence prisma:journal_entries.status Carries the persisted status value. */
  status: "draft" | "approved" | "posted" | "reversed" | "void";
/** @evidence prisma:journal_entries.created_by_user_id Carries the persisted createdByUserId value. */
  createdByUserId: string & tags.Format<"uuid">;
/** @evidence prisma:journal_entries.approved_at Carries the persisted approvedAt value. */
  approvedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:journal_entries.posted_at Carries the persisted postedAt value. */
  postedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:journal_entries.reversed_at Carries the persisted reversedAt value. */
  reversedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:journal_entries.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:journal_entries.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
  lines: IJournal.ILine[];
}
export namespace IJournal {
  /** Persisted journal line.
   * @evidence prisma:journal_lines Exposes the persisted journal_lines record.
   */
  export interface ILine {
    /** @evidence prisma:journal_lines.id Carries the persisted id value. */
    id: string & tags.Format<"uuid">;
    /** @evidence prisma:journal_lines.account_id Carries the persisted accountId value. */
    accountId: string & tags.Format<"uuid">;
    /** @evidence prisma:journal_lines.description Carries the persisted description value. */
    description: null | string;
    /** @evidence prisma:journal_lines.debit Carries the persisted debit value. */
    debit: number;
    /** @evidence prisma:journal_lines.credit Carries the persisted credit value. */
    credit: number;
    /** @evidence prisma:journal_lines.currency_code Carries the persisted currencyCode value. */
    currencyCode: string;
    /** @evidence prisma:journal_lines.exchange_rate Carries the persisted exchangeRate value. */
    exchangeRate: null | number;
  }
  export interface ICreate {
    sourceModule: string & tags.MinLength<1>;
    sourceDocumentId?: null | string;
    memo?: null | string;
    entryDate: string & tags.Format<"date-time">;
    currencyCode: string & tags.MinLength<1>;
    lines: ILineInput[];
  }
  export interface ILineInput {
    accountId: string & tags.Format<"uuid">;
    description?: null | string;
    debit: number;
    credit: number;
    currencyCode?: string;
    exchangeRate?: null | number;
  }
  export interface IUpdate { memo?: null | string; entryDate?: string & tags.Format<"date-time">; lines?: ILineInput[]; }
  export interface IRequest extends IPage.IRequest { status?: IJournal["status"]; sourceModule?: string; }
}
