import { tags } from "typia";

/** One user's active signed evaluation of a post or comment. */
/** @evidence prisma:reddit_votes Represents persisted signed vote state. */
/** @evidenceReview prisma:reddit_votes Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model Defines vote output and command shape. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-vote-model Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Carries active vote state. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Defines vote transition payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Carries vote direction input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Carries replacement direction input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Carries signed vote state. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Carries one desired direction per target. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Carries the signed value. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Carries transition output. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Carries target-bound vote state. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Carries accepted vote state output. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Carries one accepted transition result. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditVote {
  /**
   * Vote identifier.
   * @evidence prisma:reddit_votes.id Carries the vote key.
   * @evidenceReview prisma:reddit_votes.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Signed direction: +1 upvote or -1 downvote.
   * @evidence prisma:reddit_votes.value Carries the signed direction.
   * @evidenceReview prisma:reddit_votes.value Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  value: -1 | 1;
  /**
   * Creation or latest transition instant.
   * @evidence prisma:reddit_votes.created_at Carries the transition time.
   * @evidenceReview prisma:reddit_votes.created_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  createdAt: string & tags.Format<"date-time">;
}

export namespace IRedditVote {
  /** Vote state command. */
  export interface IRequest {
    /** Desired signed direction. */
    value: -1 | 1;
  }
}
