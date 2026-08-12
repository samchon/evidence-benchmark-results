import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { tags } from "typia";
import type { IPage, IRedditPost } from "@benchmark/reddit-api";
import { RedditAuth } from "../decorators/RedditAuth";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes the home, popular, and community post feeds. */
@Controller("feed")
export class FeedController {
  /** Lists available posts from the current user's subscriptions. @tag Feed */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Publishes feed operations. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed Publishes home feed scope. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range Publishes feed ranking input. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results Publishes feed pagination. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results Compared signed continuation issuance/validation with the valid and mismatched cursor journey; verified page size, scope, snapshot, and visible reset behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards Publishes feed cards. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Publishes ranking and pagination. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Compared all four ranking branches and snapshot-bound feed traversal with the requirements journey; verified order, range, and boundary assertions. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new Publishes New ordering. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range Publishes Top range ordering. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot Publishes Hot ordering. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial Publishes Controversial ordering. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries Publishes stable feed boundaries. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries Compared the signed ordered-ID snapshot with feed page selection and continuation assertions; verified equal-ranked traversal cannot be reordered by later changes. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Publishes shared pagination. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Publishes browsing continuity. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Publishes stable continuation. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Compared the signed feed snapshot and ordered-ID selection with the two-page journey; verified scope, ordering, and page size remain fixed. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Publishes continuation recovery. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Compared cursor scope validation with the mismatched-sort journey; verified recovery returns page one with reset metadata. */
  /** @evidence prisma:reddit_posts Reads feed posts. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_subscriptions Scopes the home feed. */
  /** @evidenceReview prisma:reddit_subscriptions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Patch("home")
  public async home(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedBody() body: IRedditPost.IRequest,
  ): Promise<IPage<IRedditPost.ISummary>> {
    return RedditProvider.feedHome(actor, body);
  }

  /** Lists available posts across all communities publicly. @tag Feed */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Publishes the public feed. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_posts Reads public ranked posts. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Patch("popular")
  public async popular(
    @core.TypedBody() body: IRedditPost.IRequest,
  ): Promise<IPage<IRedditPost.ISummary>> {
    return RedditProvider.feedPopular(body);
  }

  /** Lists available posts in one public community. @tag Feed */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Publishes community feed scope. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Publishes public community viewing. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_posts Reads community posts. */
  /** @evidenceReview prisma:reddit_posts Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_communities Reads community scope. */
  /** @evidenceReview prisma:reddit_communities Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Patch("community/:communityId")
  public async community(
    @core.TypedParam("communityId") communityId: string & tags.Format<"uuid">,
    @core.TypedBody() body: IRedditPost.IRequest,
  ): Promise<IPage<IRedditPost.ISummary>> {
    return RedditProvider.feedCommunity(communityId, body);
  }
}
