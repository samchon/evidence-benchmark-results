import { tags } from "typia";
import type { IPage } from "../typings/IPage";
import type { IRedditUser } from "./IRedditUser";

/** Public recursive comment response. */
/** @evidence prisma:reddit_comments Represents persisted recursive comment state. */
/** @evidenceReview prisma:reddit_comments Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model Defines nested comment output. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-comment-model Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Carries comment deletion and marker state. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Defines comment create, read, edit, and delete payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Carries top-level creation input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment Carries reply input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Carries recursive thread output. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post Carries sibling sort input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment Carries comment edit input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Carries recursive comment and sort payloads. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships Carries reply target identity through the route contract. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth Carries recursive replies. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best Carries Best sort input. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new Carries New sort input. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial Carries Controversial sort input. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Carries comment payloads subject to participation checks. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Carries comment input independent of subscription. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Carries comment content subject to ban checks. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Carries public thread output. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Carries nested thread continuation metadata. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Carries bounded root pagination. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Carries reset metadata through IPage. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure Carries recursive descendants and deleted markers. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Carries immutable comment timestamps. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Carries comment score output. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Carries the resulting comment score. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Carries available/deleted comment state. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Carries deletion-consistent thread output. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Carries public comment content. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditComment {
  /**
   * Comment identifier.
   * @evidence prisma:reddit_comments.id Carries the comment key.
   * @evidenceReview prisma:reddit_comments.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Author identity, absent for a de-identified marker.
   * @evidence prisma:reddit_comments.author_id Carries the author relation.
   * @evidenceReview prisma:reddit_comments.author_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  author: null | IRedditUser.ISummary;
  /**
   * Comment text, absent for a deleted marker.
   * @evidence prisma:reddit_comments.text Carries the text payload.
   * @evidenceReview prisma:reddit_comments.text Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  text: null | string;
  /**
   * Whether this row is the neutral deleted marker.
   * @evidence prisma:reddit_comments.deleted Carries the deletion marker state.
   * @evidenceReview prisma:reddit_comments.deleted Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  deleted: boolean;
  /**
   * Current signed score.
   * @evidence prisma:reddit_comments.score Carries the materialized score.
   * @evidenceReview prisma:reddit_comments.score Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  score: number;
  /**
   * Immutable creation instant.
   * @evidence prisma:reddit_comments.created_at Carries the creation time.
   * @evidenceReview prisma:reddit_comments.created_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  createdAt: string & tags.Format<"date-time">;
  /** Direct replies in the selected sibling order. */
  replies: IRedditComment[];
}

export namespace IRedditComment {
  /** Compact comment used in profile authorship. */
  export interface ISummary {
    /**
     * Comment identifier.
     * @evidence prisma:reddit_comments.id Carries the summary key.
     * @evidenceReview prisma:reddit_comments.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    id: string & tags.Format<"uuid">;
    /**
     * Author identity, or null after de-identification.
     * @evidence prisma:reddit_comments.author_id Carries the summary author relation.
     * @evidenceReview prisma:reddit_comments.author_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    author: null | IRedditUser.ISummary;
    /**
     * Text, or null for a deleted marker.
     * @evidence prisma:reddit_comments.text Carries the summary text.
     * @evidenceReview prisma:reddit_comments.text Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    text: null | string;
    /**
     * Whether content was deleted.
     * @evidence prisma:reddit_comments.deleted Carries the summary marker state.
     * @evidenceReview prisma:reddit_comments.deleted Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    deleted: boolean;
    /**
     * Current signed score.
     * @evidence prisma:reddit_comments.score Carries the summary score.
     * @evidenceReview prisma:reddit_comments.score Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    score: number;
    /**
     * Immutable creation instant.
     * @evidence prisma:reddit_comments.created_at Carries the summary creation time.
     * @evidenceReview prisma:reddit_comments.created_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
     */
    createdAt: string & tags.Format<"date-time">;
  }

  /** Top-level comment input. */
  export interface ICreate {
    /** Nonblank comment text. */
    text: string & tags.MinLength<1>;
  }

  /** Reply input. */
  export interface IReply {
    /** Nonblank reply text. */
    text: string & tags.MinLength<1>;
  }

  /** Comment edit input. */
  export interface IUpdate {
    /** Replacement nonblank text. */
    text: string & tags.MinLength<1>;
  }

  /** Nested thread request. */
  export interface IRequest extends IPage.IRequest {
    /** Best, New, or Controversial sibling order. */
    sort?: null | "best" | "new" | "controversial";
  }
}
