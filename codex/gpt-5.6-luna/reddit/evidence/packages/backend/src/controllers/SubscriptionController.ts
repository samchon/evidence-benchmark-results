import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { tags } from "typia";
import type { IPage, IRedditSubscription } from "@benchmark/reddit-api";
import { RedditAuth } from "../decorators/RedditAuth";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes the current user's subscription lifecycle. */
@Controller("subscription")
export class SubscriptionController {
  /** Lists the current user's active subscriptions. @tag Subscription */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Publishes subscription operations. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions Publishes subscription listing. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Publishes subscription lifecycle output. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state Publishes active state. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Publishes membership state. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Publishes paginated subscriptions. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_subscriptions Reads current user subscriptions. */
  /** @evidenceReview prisma:reddit_subscriptions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Patch()
  public async index(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedBody() body: IPage.IRequest,
  ): Promise<IPage<IRedditSubscription>> {
    return RedditProvider.subscriptionIndex(actor, body);
  }

  /** Activates the current user's subscription to one active community. @tag Subscription */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Publishes subscription activation. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state Persists active state. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Publishes the post eligibility membership. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_subscriptions Persists the relationship. */
  /** @evidenceReview prisma:reddit_subscriptions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post(":communityId")
  public async create(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
  ): Promise<IRedditSubscription> {
    return RedditProvider.subscriptionCreate(actor, communityId);
  }

  /** Ends the current user's subscription without changing roles or content. @tag Subscription */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Publishes subscription removal. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-subscription-002-end-active-subscription-state Ends active state. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-002-end-active-subscription-state Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_subscriptions Ends the relationship. */
  /** @evidenceReview prisma:reddit_subscriptions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete(":communityId")
  public async erase(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
  ): Promise<{ success: true }> {
    await RedditProvider.subscriptionErase(actor, communityId);
    return { success: true };
  }
}
