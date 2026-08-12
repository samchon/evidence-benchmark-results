import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { tags } from "typia";
import type { IPage, IRedditCommunity } from "@benchmark/reddit-api";
import { RedditAuth } from "../decorators/RedditAuth";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes public community catalog and scoped community creation. */
@Controller("community")
export class CommunityController {
  /** Lists or searches active and archived communities by normalized name. @tag Community */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations Publishes community operations. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-community-operations Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Publishes community browsing. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name Publishes community search. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Publishes discovery rules. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search Publishes normalized search ordering. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Publishes paginated discovery. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Publishes bounded page size. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Publishes continuation recovery. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_communities Reads the community catalog. */
  /** @evidenceReview prisma:reddit_communities Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Patch()
  public async index(
    @core.TypedBody() body: IRedditCommunity.IRequest,
  ): Promise<IPage<IRedditCommunity.ISummary>> {
    return RedditProvider.communityIndex(body);
  }

  /** Creates an active community and bootstraps owner/subscriber roles. @tag Community */
  /** @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Publishes community creation. */
  /** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name Publishes creation validation and uniqueness. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber Publishes initial authority and subscription bootstrap. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model Publishes the community model. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-community-model Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes Publishes community attributes. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-community-002-relate-a-community-to-its-owner Publishes owner relation. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-002-relate-a-community-to-its-owner Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers Publishes subscriber relation. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-community-004-relate-communities-to-content-and-moderation Publishes scoped relations. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-004-relate-communities-to-content-and-moderation Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_communities Persists community identity. */
  /** @evidenceReview prisma:reddit_communities Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_subscriptions Persists the owner subscription. */
  /** @evidenceReview prisma:reddit_subscriptions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_moderator_assignments Persists owner authority. */
  /** @evidenceReview prisma:reddit_moderator_assignments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post()
  public async create(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedBody() body: IRedditCommunity.ICreate,
  ): Promise<IRedditCommunity> {
    return RedditProvider.communityCreate(actor, body);
  }

  /** Opens one public community, including its current subscriber count. @tag Community */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Publishes community lifecycle state. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Publishes participation scope. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Publishes visible community aggregates. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Publishes subscription count. */
  /** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_communities Reads community lifecycle. */
  /** @evidenceReview prisma:reddit_communities Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_subscriptions Reads active subscriber count. */
  /** @evidenceReview prisma:reddit_subscriptions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Get(":id")
  public async at(
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IRedditCommunity> {
    return RedditProvider.communityAt(id);
  }
}
