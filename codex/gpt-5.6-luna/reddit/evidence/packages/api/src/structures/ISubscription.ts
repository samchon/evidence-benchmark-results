import type { tags } from "typia";
import type { ICommunity } from "./ICommunity";

/** Current user subscription projection. */
 /**
  * @evidence prisma:subscriptions Represents the persisted subscriptions model.
  */
/**
 * The ISubscription DTO boundary carries the request and response fields used by its owning operations; runtime behavior is proved there and in live tests.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle The ISubscription contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state The ISubscription contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-002-end-active-subscription-state The ISubscription contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations The ISubscription contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community The ISubscription contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community The ISubscription contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions The ISubscription contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation The ISubscription contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent The ISubscription contract carries the data shape used by this requirement; behavior is owned by the operation.
 */
 export interface ISubscription {
 /**
  * @evidence prisma:subscriptions.id Carries or derives the persisted value used by this property.
  */
 /** @evidence prisma:subscriptions.user_id Carries the persisted subscriptions.user_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:subscriptions.community_id Carries the persisted subscriptions.community_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:subscriptions.ended_at Carries the persisted subscriptions.ended_at value or its security-relevant lifecycle.
  */
    id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:subscriptions.created_at Carries or derives the persisted value used by this property.
  */
   createdAt: string & tags.Format<"date-time">;
 /**
  * @evidence prisma:communities.id Carries or derives the persisted value used by this property.
  */
   community: ICommunity;
}



