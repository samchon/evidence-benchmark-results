import type { tags } from "typia";

/** Result of a post or comment vote transition. */
 /**
  * @evidence prisma:votes Represents the persisted votes model.
  */
/**
 * The IVote DTO boundary carries the request and response fields used by its owning operations; runtime behavior is proved there and in live tests.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-002-relate-profiles-to-karma-and-authored-content The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-karma-model The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent The IVote contract carries the data shape used by this requirement; behavior is owned by the operation.
 */
 export interface IVote {
 /**
  * @evidence prisma:votes.value Carries or derives the persisted value used by this property.
  */
 /** @evidence prisma:votes.id Carries the persisted votes.id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:votes.user_id Carries the persisted votes.user_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:votes.comment_id Carries the persisted votes.comment_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:votes.created_at Carries the persisted votes.created_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:votes.updated_at Carries the persisted votes.updated_at value or its security-relevant lifecycle.
  */
    value: -1 | 0 | 1;
 /**
  * @evidence prisma:votes.value Carries or derives the persisted value used by this property.
  */
   score: number;
 /**
  * @evidence prisma:profiles.karma Carries or derives the persisted value used by this property.
  */
   karma: number;
 /**

  * @evidence prisma:votes.post_id Carries or derives the persisted value used by this property.
  */
   targetId: string & tags.Format<"uuid">;
}

export namespace IVote {
 /**
  * @evidence prisma:votes Represents the persisted votes model.
  */
   export interface IRequest {
 /**
  * @evidence prisma:votes.value Carries or derives the persisted value used by this property.
  */
     value: -1 | 1;
  }
}



