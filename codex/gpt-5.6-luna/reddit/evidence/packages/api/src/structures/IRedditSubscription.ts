import { tags } from "typia";
import type { IRedditCommunity } from "./IRedditCommunity";

/** One user-community subscription projection. */
/** @evidence prisma:reddit_subscriptions Represents persisted subscription state. */
/** @evidenceReview prisma:reddit_subscriptions Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Defines subscription output. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Defines subscription lifecycle payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Carries activation result. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Represents the ended relationship response boundary. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions Carries subscription list items. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Carries the membership relationship. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Carries the membership predicate. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Distinguishes subscription from comment eligibility. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Carries subscription state independent of bans. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Carries subscription state. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Carries the relationship that drives count and home scope. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditSubscription {
  /**
   * Subscription identifier.
   * @evidence prisma:reddit_subscriptions.id Carries the subscription key.
   * @evidenceReview prisma:reddit_subscriptions.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Subscribed community.
   * @evidence prisma:reddit_subscriptions.community_id Carries the community relation.
   * @evidenceReview prisma:reddit_subscriptions.community_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  community: IRedditCommunity.ISummary;
  /**
   * Current active state.
   * @evidence prisma:reddit_subscriptions.active Carries active state.
   * @evidenceReview prisma:reddit_subscriptions.active Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  active: boolean;
  /**
   * Current subscription start instant.
   * @evidence prisma:reddit_subscriptions.started_at Carries tenure start.
   * @evidenceReview prisma:reddit_subscriptions.started_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  startedAt: string & tags.Format<"date-time">;
}
